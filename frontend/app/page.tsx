"use client"
import Sign from "@/stateless_ui/sign";

export default function Home() {
	const origin = typeof window !== "undefined" ? window.location.origin : "aa";
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<Sign auth_uri="/api/auth/google" redirect_uri={`${origin}/api/auth/callback_oauth`}/>
		</div>
	);
}
