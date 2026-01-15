use crate::auth::TokenJwtGenerator;
use crate::auth::{self, OAuth};
use crate::collection::Collection;
use crate::out;
use firestore;
use uuid::Uuid;

pub struct Api {
	google: auth::OAuth,
	db: firestore::FirestoreDb,
	s3_temp: ngoni::s3::S3Storage,
}
impl Api {
	pub async fn new() -> Result<Self, String> {
		let storage = match std::env::var("S3_TEMP") {
			Ok(v) => v,
			Err(_) => "surfic-storage".to_string(),
		};
		Ok(Self {
			google: OAuth::load(
				"secret/sarod_oauth_google_676186616609-tvidvbklos7q5poilss55ookecj6vr14.apps.googleusercontent.com.json",
				Some("web"),
			)?,
			db: firestore::FirestoreDb::with_options_service_account_key_file(
				firestore::FirestoreDbOptions::new("lzpel-net".into())
					.with_database_id("sarod".into()),
				"secret/sarod_firestore.json".into(),
			)
			.await
			.map_err(|v| v.to_string())?,
			s3_temp: ngoni::s3::S3Storage::new(&storage).await,
		})
	}
	pub fn jwt_get(
		req: impl AsRef<axum::http::Request<axum::body::Body>>,
	) -> Option<auth::TokenJwt> {
		// AuthorizationヘッダではなくCookieのtokenで認証する：取得関数

		// Cookie ヘッダを文字列として取得
		let cookie_header = req
			.as_ref()
			.headers()
			.get(axum::http::header::COOKIE)
			.and_then(|v| v.to_str().ok())?;

		// "a=b; token=xxx.yyy.zzz; c=d" みたいな文字列から token の値だけ抜き出す
		let token = cookie_header
			.split(';')
			.map(|s| s.trim())
			.find_map(|pair| {
				let mut parts = pair.splitn(2, '=');
				let name = parts.next()?.trim();
				let value = parts.next()?.trim();
				(name == "token").then(|| value)
			})?;
		out::User::validate_jwt(token).ok()
	}
	pub fn jwt_set(v: Option<impl TokenJwtGenerator>) -> axum::http::Response<axum::body::Body> {
		// AuthorizationヘッダではなくCookieのtokenで認証する：設定関数
		let jwt = v
			.map(|v| (v.signed_jwt(), v.jwt().age().unwrap_or(86400)))
			.unwrap_or_default();
		axum::response::Response::builder()
			.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
			.header(
				"Set-Cookie",
				format!("token={}; Path=/; Max-Age={}", jwt.0, jwt.1),
			)
			.header(axum::http::header::LOCATION, "/")
			.body(axum::body::Body::from(jwt.0))
			.unwrap()
	}
}
impl out::ApiInterface for Api {
	async fn authorize(
		&self,
		req: axum::http::Request<axum::body::Body>,
	) -> Result<out::AuthContext, String> {
		// まだどのタイプの認証方式が指定されているのか見分けていない
		// Cookie ヘッダを文字列として取得
		let cookie_header = req
			.headers()
			.get(axum::http::header::COOKIE)
			.and_then(|v| v.to_str().ok())
			.unwrap_or_default();
		// "a=b; token=xxx.yyy.zzz; c=d" みたいな文字列から token の値だけ抜き出す
		let token = cookie_header
			.split(';')
			.map(|s| s.trim())
			.find_map(|pair| {
				let mut parts = pair.splitn(2, '=');
				let name = parts.next()?.trim();
				let value = parts.next()?.trim();
				(name == "token").then(|| value)
			})
			.unwrap_or_default();
		out::User::validate_jwt(token)
			.map(|v| out::AuthContext {
				subject: v.sub,
				..Default::default()
			})
			.map_err(|v| v.to_string())
	}
	async fn authapi_email(&self, req: out::AuthapiEmailRequest) -> out::AuthapiEmailResponse {
		let origin = out::origin_from_request(&req.request).unwrap_or_default();
		let language = language_from_headers(&req.request.headers()).unwrap_or_default();
		let (subject, body) = auth::email::validate_email(
			"Plant Mimamori",
			&language,
			&origin,
			&format!(
				"{origin}/register?token={}",
				auth::email::jwt_from_email(&req.body.email)
			),
			"2025-12-20",
			"support@surfic.com",
		);
		match ngoni::ses::send_email("info@surfic.com", &req.body.email, &subject, &body).await {
			Ok(_) => return out::AuthapiEmailResponse::Status204,
			Err(e) => return out::AuthapiEmailResponse::Status400(e.to_string()),
		}
	}
	async fn authapi_google(&self, req: out::AuthapiGoogleRequest) -> out::AuthapiGoogleResponse {
		let base_redirect_url = out::origin_from_request(&req.request).unwrap_or_default();
		let redirect_uri = self
			.google
			.redirect_uri(&format!("{base_redirect_url}/api/auth/callback_oauth"));
		//?state=019ae005-152c-7971-b81f-a60c749498b1&code=4%2F0Ab32j91qKnhNiU2ELrr4xE2579NVRRrVlZGMcaeJRIib8U_WDIeXt1axRTc2rdppI9XGEA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
		out::AuthapiGoogleResponse::Raw(
			axum::response::Response::builder()
				.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
				.header(axum::http::header::LOCATION, redirect_uri) // リダイレクト先のURLを Location ヘッダーに設定
				.body(axum::body::Body::empty()) //				// ボディがないため、空のボディを設定してビルド
				.unwrap(),
		)
	}
	async fn authapi_callback_oauth(
		&self,
		req: out::AuthapiCallbackOauthRequest,
	) -> out::AuthapiCallbackOauthResponse {
		let inner = async || -> Result<_, String> {
			let a = self.google.callback(&req.state, &req.code).await?;
			let b = a.jwt()?;
			let c = out::User::query(
				&self.db,
				|q: crate::collection::FilterBuilder| q.field("auth_google").eq(&b.sub),
				None,
				None,
				None,
			)
			.await?;
			let w = if let Some(d) = c.first() {
				d.clone()
			} else {
				let r = out::User {
					id: Uuid::now_v7(),
					name: b.name,
					picture: b.picture.unwrap(),
					auth_email: b.email,
					auth_google: b.sub,
					is_active: true,
					..Default::default()
				};
				r.push(&self.db).await.map(|_| r)?
			};
			Ok(w)
		};
		match inner().await {
			Err(e) => out::AuthapiCallbackOauthResponse::Status400(e),
			Ok(v) => {
				let jwt = v.jwt();
				let jwt_str = v.signed_jwt();
				out::AuthapiCallbackOauthResponse::Raw(
					axum::response::Response::builder()
						.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
						.header(
							"Set-Cookie",
							format!(
								"token={jwt_str}; Path=/; Max-Age={age}",
								age = jwt.age().unwrap_or(86400)
							),
						)
						.header(axum::http::header::LOCATION, "/")
						.body(axum::body::Body::from(jwt_str))
						.unwrap(),
				)
			}
		}
	}
	async fn authapi_out(&self, _req: out::AuthapiOutRequest) -> out::AuthapiOutResponse {
		out::AuthapiOutResponse::Raw(Self::jwt_set(None::<out::User>))
	}
	async fn userapi_user_pop(
		&self,
		req: out::UserapiUserPopRequest,
	) -> out::UserapiUserPopResponse {
		let Some(v) = Self::jwt_get(req) else {
			return out::UserapiUserPopResponse::Status403;
		};
		match out::User::pop(&self.db, &v.sub).await {
			Ok(_) => out::UserapiUserPopResponse::Status204,
			Err(e) => out::UserapiUserPopResponse::Status400(e),
		}
	}
	async fn userapi_user_get(
		&self,
		req: out::UserapiUserGetRequest,
	) -> out::UserapiUserGetResponse {
		let Some(v) = Self::jwt_get(req) else {
			return out::UserapiUserGetResponse::Status403;
		};
		match out::User::get(&self.db, &v.sub).await {
			Ok(u) => out::UserapiUserGetResponse::Status200(u),
			Err(e) => out::UserapiUserGetResponse::Status400(e),
		}
	}
	async fn pageapi_upload(&self, req: out::PageapiUploadRequest) -> out::PageapiUploadResponse {
		// 指定されたファイル名と有効期限で署名付きURLを生成します
		// s3のcors設定でallowed originに送信元を入れないとエラーになります
		let expires = std::time::Duration::from_secs(req.expiresIn.unwrap_or(3600) as u64);
		let path = format!("{}_{}", uuid::Uuid::now_v7(), req.fileName);
		match self
			.s3_temp
			.presign_write_url(&path, expires)
			.await
		{
			Ok(url) => out::PageapiUploadResponse::Status200([path, url].to_vec()),
			Err(e) => out::PageapiUploadResponse::Status400(e.to_string()),
		}
	}
}

pub fn language_from_headers(
	headers: &axum::http::HeaderMap<axum::http::HeaderValue>,
) -> Option<String> {
	headers
		.get(axum::http::header::ACCEPT_LANGUAGE)
		.and_then(|v| v.to_str().ok())
		.map(str::trim)
		.filter(|s| !s.is_empty())
		.map(str::to_string)
}

impl Collection for out::User {
	fn collection_name() -> &'static str {
		"user"
	}
	fn document_id(&self) -> String {
		self.id.to_string()
	}
}
impl Collection for out::Page {
	fn collection_name() -> &'static str {
		"page"
	}
	fn document_id(&self) -> String {
		self.id.to_string()
	}
}

impl TokenJwtGenerator for out::User {
	fn secret() -> &'static [u8] {
		b"abc"
	}
	fn jwt(&self) -> auth::TokenJwt {
		let o = auth::TokenJwt {
			sub: self.id.to_string(),
			email: self.auth_email.clone(),
			name: self.name.clone(),
			picture: Some(self.picture.clone()),
			..Default::default()
		};
		println!("{:?}", o);
		o
	}
}
