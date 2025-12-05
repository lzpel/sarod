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

model Rule {
	id: UUID;//一意
	id_root: UUID;//親
	name: string;//名前
	script: string;//名前
}

model Page {
	id: UUID;//一意
	id_root: UUID;//親
	id_node: UUID;//ルール
	content: string;//名前
}

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
		ユーザーを追加します、認証が不要だが、メールアドレスが確認されるまでアクティベートされない
	""")
	@post email(name: string, auth_email: string, auth_email_password: string): string | BadRequestResponse;
	@doc("""
		google ログイン
	""")
	@route("/google") @get google(@query redirect: string): string;
	@doc("""
		oauth コールバック用
	""")
	@route("/callback_oauth") @get callback_oauth(@query code: string, @query state: string): string|BadRequestResponse;
	@doc("""
		ログアウト
	""")
	@route("/out") @get out(): NotFoundResponse
}

@useAuth(BearerAuth)
@route("/user")
interface UserApi {
	@doc("""
		ユーザーを削除します、認証が必要
	""")
	@delete user_pop(@path id: UUID): NoContentResponse | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ユーザー情報を取得します、認証が必要
	""")
	@get user_get(@path id: UUID): User | ForbiddenResponse | BadRequestResponse;
}

// 一個一個のルールを編集する
@useAuth(BearerAuth)
@route("/rule")
interface RuleApi {
	@doc("""
		ルール一覧を返します
	""")
	@get rule_list(): Rule[] | ForbiddenResponse | BadRequestResponse;
	@doc("""
		ルールを追加/更新します
	""")
	@post rule_push(rule: Rule): Rule | ForbiddenResponse | BadRequestResponse;
}