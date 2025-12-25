import "@typespec/http";

using Http;
@service(#{ title: "Sarod" })
@server("/api", "開発用")
namespace DemoService;

model Response<code extends numeric, Body> {
	@statusCode statusCode: code;
	@body body: Body;
}
model NoContentResponse is Response<204, null>;
model BadRequestResponse is Response<400, string>;
model ForbiddenResponse is Response<403, null>;
model NotFoundResponse is Response<404, null>;
@format("uuid")
scalar UUID extends string;

model User {
	id: UUID;//一意
	name: string;//名前
	picture: string;//アイコン
	auth_email: string;
	auth_google: string;
	auth_email_password: string;
	is_active: boolean;
}

model Page {
	id: UUID;//一意
	id_root: UUID;//親
	id_node: UUID;//ルール
	name: string;//名前
	content: string;//名前
	value_trending: int32;
	value_popularity: int32;
	score_day: int32;
	score_week: int32;
	score_month: int32;
}

model Video is Page;

// 課金系

model Plan {
	id: UUID;               // "free", "pro", "team" など
	name: string;
	priceMonthly: int32;      // 円なら税込の金額
	currency: "JPY" | "USD";
	description?: string;
}


model Subscription {
	id: UUID;
	id_root: UUID;
	id_node: UUID;
	status: "active" | "trialing" | "canceled" | "past_due";
}

@route("/auth")
interface AuthApi {
	@doc("""
		指定メールアドレスにそのメールアドレスが正しいことを確認するリンクを送ります
		そのリンクを踏んだ人だけがユーザー追加画面にたどり着けます
		uri: コールバック用にドメインをフロントエンドから抽出する
		email: メールアドレス
	""")
	@route("/email") @post email(email: string): NoContentResponse | BadRequestResponse;
	@doc("""
		ユーザーを追加します
		token_challenge: ロボットではないことの確認のためのトークン
		token_email: メールアドレスが正しいことを確認するためのトークン
	""")
	@route("/signup") @post signup(name: string, auth_email: string, auth_email_password: string, token_challenge: string, token_email: string): User | BadRequestResponse;
	@doc("""
		google ログイン
	""")
	@route("/google") @get google(): string;
	@doc("""
		ユーザーを追加します
		oauth コールバック用
	""")
	@route("/callback_oauth") @get callback_oauth(@query code: string, @query state: string): string|BadRequestResponse;
	@doc("""
		ログアウト
	""")
	@route("/out") @get out(): NoContentResponse
}

@useAuth(BearerAuth)
@route("/user")
interface UserApi {
	@doc("""
		ユーザーを削除します、認証が必要
	""")
	@delete user_pop(): NoContentResponse | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザー情報を取得します、認証が必要
	""")
	@get user_get(): User | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザーの名前やプロフィールの設定を行う、認証が必要
	""")
	@post user_set(user: User): User | ForbiddenResponse | BadRequestResponse;
}

// 一個一個の動画を編集する
@useAuth(BearerAuth)
@route("/video")
interface VideoApi {
	@doc("""
		ホーム画面用の動画一覧を返します、認証が必要
	""")
	@route("/home") @get home(cursor: UUID, limit: int32): Video[] | ForbiddenResponse | BadRequestResponse;
	@doc("""
		動画を追加/更新します、認証が必要
	""")
	@post push(video: Video): Video | ForbiddenResponse | BadRequestResponse;
}