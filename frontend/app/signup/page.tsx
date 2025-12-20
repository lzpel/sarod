//- import { useAuth } from "@/src/AuthProvider";が何かを返すならログインしているとみなして/homeへfrontend\src\Redirect.tsx
//- nullを返すならstateless_ui/Signを表示する
//- googleログインなら/api/auth/googleにリンク
//- ログインしたいユーザーは/signinにリンク
//- メールでサインアップしたいユーザーはauthApiEmailを呼び出し、MessageをSignInUpのchildrenに渡す(渡せるように必要ならSignInUpの型を修正)
//共通ルール：全体
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//共通ルール：stateless_ui/以下
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

"use client";

import { useAuth } from "@/src/AuthProvider";
import { Redirect } from "@/src/Redirect";
import SignInUp from "@/stateless_ui/SignInUp";
import { Message } from "@/stateless_ui/Message";
import { authApiEmail } from "@/src/out";
import { useState } from "react";

export default function SignupPage() {
	const { iam, loading } = useAuth();
	const [message, setMessage] = useState<React.ReactNode | null>(null);

	// ログインしているなら/homeへ
	if (iam) {
		return <Redirect target="/home" />;
	}

	// Loading中などの扱いは仕様上明確ではないが、nullを返すならSignInUpを表示という指示なので
	// loading中はnullを返してSignInUpを表示せず待つか、あるいはそのまま表示するか。
	// 指示: "nullを返すならstateless_ui/Signを表示する" (Assuming "Sign" meant "SignInUp")
	// If iam is null, we show the page. loading is separate.
	// Usually we wait for loading to finish before redirecting, to avoid flash.
	if (loading) {
		return null; // Don't show anything while checking auth status
	}

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;

		if (!email) {
			setMessage(
				<Message variant="error">
					メールアドレスを入力してください
				</Message>
			);
			return;
		}

		try {
			// Assuming authApiEmail takes an object with email property
			await authApiEmail({ email });
			setMessage(
				<Message variant="success" title="メール送信完了">
					確認メールを送信しました。メール内のリンクから登録を完了してください。
				</Message>
			);
		} catch (error) {
			console.error(error);
			setMessage(
				<Message variant="error" title="エラー">
					サインアップ処理に失敗しました。時間をおいて再度お試しください。
				</Message>
			);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background-default">
			<SignInUp
				mode="signup"
				googleAction="/api/auth/google"
				toggleLinkHref="/signin"
				onSubmit={handleSignup}
			>
				{message}
			</SignInUp>
		</div>
	);
}
