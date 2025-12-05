import getCookie from "./cookie";
import decodeJwtPayload from "./jwt";
// 説明
// client_jwt()は、
// 1. クッキーからtokenを取得する
// 2. tokenをdecodeする
// 3. decodeしたtokenを返す
export function client_jwt(): JwtStandard | null {
	const token = getCookie("token")
	if (!token) {
		return null
	}
	return decodeJwtPayload<JwtStandard>(token)
}


export type JwtStandard = {
	sub: string;
	email: string;
	exp?: number;
	picture: string;
	name: string;
};