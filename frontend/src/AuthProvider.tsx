// src/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, userApiUserGet } from "@/src/out";

//基本情報
type IAM =	User
const WhoAmI = async () => (await userApiUserGet()).data

//認証コンテキスト
type AuthContextValue = {
	iam: IAM | null;
	loading: boolean;
	reload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [iam, setIam] = useState<IAM | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchIam = async () => {
		try {
			setLoading(true);
			setIam(await WhoAmI());
		} catch (e) {
			setIam(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchIam();
	}, []);

	return (
		<AuthContext.Provider value={{ iam, loading, reload: fetchIam }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within <AuthProvider />");
	}
	return ctx;
}