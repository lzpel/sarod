pub trait Collection: for<'a> serde::Deserialize<'a> + serde::Serialize + Sync + Send {
	fn collection_name() -> &'static str;
	fn document_id(&self) -> String;
	async fn get(db: &firestore::FirestoreDb, document_id: &str) -> Result<Self, String> {
		let v: Option<Self> = db
			.fluent()
			.select()
			.by_id_in(Self::collection_name())
			.obj()
			.one(document_id)
			.await
			.map_err(|v| v.to_string())?;
		match v {
			Some(v) => Ok(v),
			None => Err("not found".to_string()),
		}
	}
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
	async fn query(
		db: &firestore::FirestoreDb,
		name: &str,
		value: &str,
	) -> Result<Vec<Self>, String> {
		// "users" コレクションから "email" フィールドが target_email と一致するものを検索
		let users: Vec<Self> = db
			.fluent()
			.select()
			.from(Self::collection_name())
			.filter(|q| {
				// "email" == target_email
				q.field(name).eq(value)
			})
			.obj()
			.query()
			.await
			.map_err(|v| v.to_string())?;
		Ok(users)
	}
	async fn pop(db: &firestore::FirestoreDb, document_id: &str) -> Result<(), String> {
		db.fluent()
			.delete()
			.from(Self::collection_name())
			.document_id(document_id)
			.execute()
			.await
			.map_err(|v| v.to_string())
	}
}
