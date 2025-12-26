use firestore::{
	FirestoreQueryCursor, FirestoreQueryDirection, FirestoreQueryFilter, FirestoreQueryOrder,
	FirestoreValue, select_filter_builder::FirestoreQueryFilterBuilder,
};
pub type FilterBuilder = FirestoreQueryFilterBuilder;
pub fn none_filter(q: FilterBuilder) -> Option<FirestoreQueryFilter> {
	None
}
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
	async fn query<'a>(
		db: &firestore::FirestoreDb,
		filters: impl Fn(FirestoreQueryFilterBuilder) -> Option<FirestoreQueryFilter>,
		order: Option<OrderBy>,
		cursor: Option<FirestoreValue>,
		limit: Option<u32>,
	) -> Result<Vec<Self>, String> {
		let builder: _ = db
			.fluent()
			.select()
			.from(Self::collection_name())
			.filter(filters);
		let builder = if let Some(order) = order {
			//特定のフィールドを基準にクエリを並べ替えると、order-by フィールドが存在するドキュメントのみを返すことができます。
			//id基準でソートするならuuidの一意性を前提に、衝突を考えなくていい、そしてid基準以外でソートするときにページ境界で抜けがあってもいいことにする
			builder.order_by([order, OrderBy::Desc("__name__")])
		} else {
			builder
		};
		let builder = if let Some(cursor) = cursor {
			builder.start_at(FirestoreQueryCursor::AfterValue([cursor].into()))
		} else {
			builder
		};
		let builder = if let Some(limit) = limit {
			builder.limit(limit)
		} else {
			// https://note.com/etet_etet/n/n4ed0d6f59416
			// collectionに対してlimitかけずに get() してしまうことで、コレクション内のドキュメント（開発環境だと数千レコード）がすべて read されてしまっていたのです。結果は配列の先頭のみ返すので、1件だけで良かったのに、毎回毎回ユーザーがアクセスするたびに数千件を引っ張り出して、最初の1件だけ返していたことが判明しました。
			builder.limit(100)
		};
		let output: Vec<Self> = builder.obj().query().await.map_err(|v| v.to_string())?;
		Ok(output)
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

pub enum OrderBy {
	Asc(&'static str),
	Desc(&'static str),
}

impl From<OrderBy> for FirestoreQueryOrder {
	fn from(value: OrderBy) -> Self {
		match value {
			OrderBy::Asc(field) => Self {
				field_name: field.to_string(),
				direction: FirestoreQueryDirection::Ascending,
			},
			OrderBy::Desc(field) => Self {
				field_name: field.to_string(),
				direction: FirestoreQueryDirection::Descending,
			},
		}
	}
}
