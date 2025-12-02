use crate::out;
use firestore;
use uuid::Uuid;

pub struct Api {
	db: firestore::FirestoreDb,
}
impl Api {
	pub async fn new() -> Result<Self, String> {
		Ok(Self {
			db: firestore::FirestoreDb::with_options_service_account_key_file(
				firestore::FirestoreDbOptions::new("lzpel-net".into())
					.with_database_id("sarod".into()),
				"out.json".into(),
			)
			.await
			.map_err(|v| v.to_string())?,
		})
	}
}
impl out::ApiInterface for Api {
	async fn userlistapi_user_push(
		&self,
		req: out::UserlistapiUserPushRequest,
	) -> out::UserlistapiUserPushResponse {
		if req.body.auth_google.is_some()
			|| (req.body.auth_email.is_some() && req.body.auth_email_password.is_some())
		{
			let r = out::User {
				id: Uuid::now_v7(),
				name: req.body.name,
				icon: Default::default(),
				auth_email: req.body.auth_email.unwrap_or_default(),
				auth_google: req.body.auth_google.unwrap_or_default(),
				auth_email_password: req.body.auth_email_password.unwrap_or_default(),
				is_active: false,
			};
			match r.push(&self.db).await {
				Ok(_) => return out::UserlistapiUserPushResponse::Status200(r),
				Err(e) => return out::UserlistapiUserPushResponse::Status400(e.to_string()),
			}
		}
		out::UserlistapiUserPushResponse::Status400(
			"require google-auth or email-auth(address and password)".into(),
		)
	}
}

trait Collection: for<'a> serde::Deserialize<'a> + serde::Serialize + Sync + Send {
	fn collection_name() -> &'static str;
	fn document_id(&self) -> String;
	async fn push(&self, db: &firestore::FirestoreDb) -> Result<(), String> {
		db.fluent()
			.insert()
			.into(Self::collection_name())
			.document_id(&self.document_id())
			.object(self)
			.execute()
			.await
			.map_err(|v| v.to_string())
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
