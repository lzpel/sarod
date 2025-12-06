"use client"
import TwitterHome, { TwitterUser } from "@/stateless_ui/TwitterHome"
import { useAuth } from "@/src/AuthProvider";
import { Redirect } from "@/src/redirect";
export default function page() {
	const { iam } = useAuth();
	if (iam) {
		const x: TwitterUser = {
			name: iam.name,
			sub: iam.id,
			picture: iam.picture,
		}
		return <TwitterHome user={x}>
		</TwitterHome>
	}else{
		return <Redirect target="/" />
	}
}