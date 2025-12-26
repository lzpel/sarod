"use client"
import Redirect from "@/stateless_ui/Redirect";
import Profile from "@/stateless_ui/Profile";
import { useUser } from "@/app/Provider";

export default function Page() {
	const { user, loading } = useUser();
	if (loading) {
		return <div>Loading...</div>;
	}
	if (user) {
		return <Redirect target="/home" />
	}
	return <Profile />;
}
