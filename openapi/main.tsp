import "@typespec/http";

using Http;
@service(#{ title: "Sarod" })
@server("/api", "開発用")
namespace DemoService;

model Response<code extends numeric> {
	@statusCode statusCode: code;
}
@error
model ErrorResponse<code extends numeric> extends Response<code> {
	@header contentType: "text/plain";
	@body value: string;
}
model NoContentResponse is Response<204>;
model NotFoundResponse is ErrorResponse<404>;
model BadRequestResponse is ErrorResponse<400>;
@format("uuid")
scalar UUID extends string;

model User {
	id: UUID;//一意
	name: string;//名前
	icon: string;//アイコン
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

@route("/user")
interface UserListApi {
	@doc("""
		ユーザー一覧を返します
	""")
	@get user_list(): User[] | NotFoundResponse;
	@doc("""
		ユーザー一覧を追加します、登録前にGoogle アカウントやメールアドレスの認証が必要
		( auth_email && auth_email_password ) || auth_google
	""")
	@post user_push(name: string, auth_email?: string, auth_email_password?: string, auth_google?: string): User | BadRequestResponse;
}


@route("/user/{id}")
interface UserApi {
	@doc("""
		ユーザーを削除します、認証が必要
	""")
	@delete user_pop(@path id: UUID): User | BadRequestResponse;
	@doc("""
		ユーザー情報を取得します、認証が必要
	""")
	@get user_get(@path id: UUID): User | BadRequestResponse;
}