"use client"
import TwitterHome, { TwitterUser } from "@/stateless_ui/TwitterHome"
import { client_jwt } from "@/src/standard"
export default function page() {
	const n = client_jwt()
	console.log(n)
	if (n) {
		const x: TwitterUser = {
			name: n.name,
			sub: n.sub,
			picture: n.picture,
		}
		console.log(x)
		return <TwitterHome user={x}>
		</TwitterHome>
	}
	return "un auth"
}