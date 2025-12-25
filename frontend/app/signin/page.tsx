//- SignInUpを利用してログイン画面を出して
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

"use client";

import { useUser } from "@/app/Provider";
import Redirect from "@/stateless_ui/Redirect";
import SignInUp from "@/stateless_ui/SignInUp";
import { Message } from "@/stateless_ui/Message";
import { authApiEmail } from "@/src/out";
import { useState } from "react";

export default function SigninPage() {
	const { user, loading } = useUser();
	const [message, setMessage] = useState<React.ReactNode | null>(null);

	// ログインしているなら/homeへ
	if (user) {
		return <Redirect target="/home" />;
	}

	if (loading) {
		return null;
	}

	const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
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
			// Signin uses same magic link flow as signup
			await authApiEmail({ email });
			setMessage(
				<Message variant="success" title="メール送信完了">
					確認メールを送信しました。メール内のリンクからログインを完了してください。
				</Message>
			);
		} catch (error) {
			console.error(error);
			setMessage(
				<Message variant="error" title="エラー">
					ログイン処理に失敗しました。時間をおいて再度お試しください。
				</Message>
			);
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background-default">
			<SignInUp
				mode="signin"
				googleAction="/api/auth/google"
				toggleLinkHref="/signup"
				onSubmit={handleSignin}
				hidePassword={true}
			>
				{message}
			</SignInUp>
		</div>
	);
}