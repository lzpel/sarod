"use client"
import { useAuth } from "@/src/AuthProvider";
import { Redirect } from "@/src/redirect";
import Profile from "@/stateless_ui/Profile";

export default function Home() {
	const { iam } = useAuth();
	if (iam) {
		return <Redirect target="/home" />
	}
	return (
		<>
			<Profile />
		</>
	);
}
