use crate::auth;
use crate::auth::TokenJwtGenerator;
use crate::collection::Collection;
use crate::out;
use firestore;
use uuid::Uuid;

pub struct Api {
	google: auth::OAuth,
	db: firestore::FirestoreDb,
}
impl Api {
	pub async fn new() -> Result<Self, String> {
		Ok(Self {
			google: auth::GoogleOAuthSecret::load(
				"secret/sarod_oauth_google_676186616609-tvidvbklos7q5poilss55ookecj6vr14.apps.googleusercontent.com.json",
			)?,
			db: firestore::FirestoreDb::with_options_service_account_key_file(
				firestore::FirestoreDbOptions::new("lzpel-net".into())
					.with_database_id("sarod".into()),
				"secret/sarod_firestore.json".into(),
			)
			.await
			.map_err(|v| v.to_string())?,
		})
	}
}
impl out::ApiInterface for Api {
	async fn authapi_email(
		&self,
		req: out::AuthapiEmailRequest,
	) -> out::AuthapiEmailResponse {
		let r = out::User {
			id: Uuid::now_v7(),
			name: req.body.name,
			auth_email: req.body.auth_email,
			auth_email_password: req.body.auth_email_password,
			..Default::default()
		};
		match r.push(&self.db).await {
			Ok(_) => return out::AuthapiEmailResponse::Status200(r.signed_jwt()),
			Err(e) => return out::AuthapiEmailResponse::Status400(e.to_string()),
		}
	}
	async fn authapi_google(&self, req: out::AuthapiGoogleRequest) -> out::AuthapiGoogleResponse {
		let redirect_uri = self.google.redirect_uri(&req.redirect);
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
			let c = out::User::query(&self.db, "auth_google", &b.sub).await?;
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
	async fn authapi_out(
			&self,
			_req: out::AuthapiOutRequest,
		) -> out::AuthapiOutResponse {
		out::AuthapiOutResponse::Raw(
			axum::response::Response::builder()
				.status(axum::http::StatusCode::TEMPORARY_REDIRECT)
				.header(
					"Set-Cookie",
					format!(
						"token=; Path=/; Max-Age=0",
					),
				)
				.header(axum::http::header::LOCATION, "/")
				.body(axum::body::Body::empty())
				.unwrap(),
		)
	}
	async fn userapi_user_pop(
			&self,
			req: out::UserapiUserPopRequest,
		) -> out::UserapiUserPopResponse {
		todo!("この実装には認証結果を得るようにmandolinを改良する必要がある")
	}
	async fn userapi_user_get(
			&self,
			req: out::UserapiUserGetRequest,
		) -> out::UserapiUserGetResponse {
		todo!("この実装には認証結果を得るようにmandolinを改良する必要がある")
	}
	async fn ruleapi_rule_list(
			&self,
			_req: out::RuleapiRuleListRequest,
		) -> out::RuleapiRuleListResponse {
		todo!("この実装には認証結果を得るようにmandolinを改良する必要がある")
	}
	async fn ruleapi_rule_push(
			&self,
			_req: out::RuleapiRulePushRequest,
		) -> out::RuleapiRulePushResponse {
		todo!("この実装には認証結果を得るようにmandolinを改良する必要がある")
	}
	async fn ruleapi_rule_edit(
			&self,
			_req: out::RuleapiRuleEditRequest,
		) -> out::RuleapiRuleEditResponse {
		todo!("この実装には認証結果を得るようにmandolinを改良する必要がある")
	}
}

impl Collection for out::User {
	fn collection_name() -> &'static str {
		"user"
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
