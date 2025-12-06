"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Redirect({ target }: { target: string }) {
	const router = useRouter();

	useEffect(() => {
		router.replace(target);
	}, [router, target]);

	return null; // 何も表示しない
}