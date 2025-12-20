"use client"
import Sign from "@/stateless_ui/Sign";
import { useAuth } from "@/src/AuthProvider";
import { Redirect } from "@/src/redirect";

export default function Home() {
	const { iam } = useAuth();
	if (iam) {
		return <Redirect target="/home" />
	}
	return (
		<>
			<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
				<Sign auth_uri="/api/auth/google" redirect_uri={`${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/callback_oauth`} />
			</div>
		</>
	);
}
