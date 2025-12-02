import "@typespec/http";

using Http;
@service(#{ title: "Widget Service" })
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
	uuid: UUID;//一意
	name: string;//名前
	icon: string;//名前
	hashed_password: string;//ハッシュ化されたパスワード
}

model Rule {
	uuid: UUID;//一意
	uuid_root: UUID;//親
	name: string;//名前
	script: string;//名前
}

model Page {
	uuid: UUID;//一意
	uuid_node: UUID;//ルール
	uuid_root: UUID;//親
	content: string;//名前
}

@route("/user")
interface Main {
	/** List widgets */
	@get list(): User[] | NotFoundResponse;
}
