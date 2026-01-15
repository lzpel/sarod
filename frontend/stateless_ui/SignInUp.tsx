//- ログインとサインアップの部品をexport default function。ログインはメールとパスワードを入力するかGoogleアカウントから入力するか両方の選択肢がある、サインアップはメールアドレスのみを入力するかGoogleアカウントから入力するかの選択肢がある
//共通ルール
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- stateless_ui/以下に配置されている部品は外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//- 以上の共通ルールは保持、共通ルール以降に内容を実装して

import React from 'react';
import { FormControl, Input } from './FormControls';

// ... (existing code)
/**
 * Googleのアイコン（SVG）
 */
function GoogleIcon() {
	return (
		<svg className="h-4 w-4" viewBox="0 0 24 24">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

type SignInUpProps = {
	mode: "signin" | "signup";

	// Display config
	hasForm?: boolean; // Default is true

	// Text config (optional overrides)
	title?: string;
	description?: string;

	// Event handlers
	onGoogleClick?: (() => void) | string;
	onSubmit?: (data: { email?: string; password?: string }) => void;

	// Links
	toggleLinkHref?: string;

	// Custom Content (e.g. Messages)
	children?: React.ReactNode;

	// Optional: Hide password field (for Magic Link only mode)
	// If true, password field is not shown even in signin mode
	hidePassword?: boolean;
};

/**
 * ログイン/サインアップ画面
 */
export default function SignInUp(props: SignInUpProps) {
	const isSignIn = props.mode === "signin";
	const hasForm = props.hasForm ?? true;
	const hidePassword = props.hidePassword ?? false;

	const defaultTitle = isSignIn ? "ログイン" : "アカウント作成";
	const defaultDesc = isSignIn
		? "アカウントにログインして続行してください"
		: "メールアドレスを入力してアカウントを作成";

	const toggleText = isSignIn
		? "アカウントをお持ちでない場合は"
		: "すでにアカウントをお持ちですか？";
	const toggleLinkText = isSignIn ? "新規登録" : "ログイン";

	const toggleLinkHref = props.toggleLinkHref || "#";

	/**
	 * フォーム送信時の処理
	 */
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		props.onSubmit?.({ email, password });
	};

	return (
		<div className="mx-auto w-full max-w-sm rounded-xl border border-divider bg-background-paper p-6 shadow-sm">
			<h1 className="text-xl font-bold text-text-primary mb-1">
				{props.title || defaultTitle}
			</h1>
			<p className="text-sm text-text-secondary mb-6">
				{props.description || defaultDesc}
			</p>

			{/* Custom Content (Messages, etc) */}
			{props.children && (
				<div className="mb-6">
					{props.children}
				</div>
			)}

			{/* Google Sign In/Up */}
			<div className="mb-6">
				{typeof props.onGoogleClick === "string" ? (
					<a
						href={props.onGoogleClick}
						className="w-full flex items-center justify-center gap-2 rounded-md border border-divider bg-background-paper px-4 py-2 text-sm font-medium text-text-primary hover:bg-action-hover/10 transition-colors"
					>
						<GoogleIcon />
						Google で続行
					</a>
				) : (
					<button
						type="button"
						onClick={props.onGoogleClick as any}
						className="w-full flex items-center justify-center gap-2 rounded-md border border-divider bg-background-paper px-4 py-2 text-sm font-medium text-text-primary hover:bg-action-hover/10 transition-colors"
					>
						<GoogleIcon />
						Google で続行
					</button>
				)}
			</div>

			{hasForm && (
				<>
					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-divider"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background-paper px-2 text-text-secondary">
								または
							</span>
						</div>
					</div>

					{/* Email Form */}
					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<FormControl label="メールアドレス">
								<Input
									name="email"
									type="email"
									placeholder="name@example.com"
									required
								/>
							</FormControl>

							{/* Password field only for SignIn mode AND not hidden */}
							{isSignIn && !hidePassword && (
								<FormControl label="パスワード">
									<Input
										name="password"
										type="password"
										required
									/>
								</FormControl>
							)}

							<button
								type="submit"
								className="w-full rounded-md bg-primary-main px-4 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
							>
								{isSignIn ? "ログイン" : "メールアドレスで登録"}
							</button>
						</div>
					</form>
				</>
			)}

			<p className="mt-6 text-center text-xs text-text-secondary">
				{toggleText}{" "}
				<a href={toggleLinkHref} className="text-primary-main hover:text-primary-dark hover:underline">
					{toggleLinkText}
				</a>
			</p>
		</div>
	);
}

/**
 * Example component showcasing both modes
 */
export function Example() {
	return (
		<div className="grid gap-8 p-8 bg-background-default lg:grid-cols-2">
			<div className="flex flex-col items-center justify-center gap-4">
				<p className="text-text-primary font-bold">Mode: SignIn (Password)</p>
				<SignInUp
					mode="signin"
					onSubmit={(data) => console.log("SignIn:", data)}
					toggleLinkHref="#"
				/>
			</div>

			<div className="flex flex-col items-center justify-center gap-4">
				<p className="text-text-primary font-bold">Mode: SignIn (Magic Link / No Password)</p>
				<SignInUp
					mode="signin"
					onSubmit={(data) => console.log("MagicLink:", data)}
					toggleLinkHref="#"
					hidePassword={true}
				/>
			</div>

			<div className="flex flex-col items-center justify-center gap-4">
				<p className="text-text-primary font-bold">Mode: SignUp</p>
				<SignInUp
					mode="signup"
					onSubmit={(data) => console.log("SignUp:", data)}
					toggleLinkHref="#"
				>
					<div className="bg-info-main/10 border border-info-main/20 text-text-primary p-3 rounded text-sm text-center">
						Example Message Child
					</div>
				</SignInUp>
			</div>

			<div className="flex flex-col items-center justify-center gap-4">
				<p className="text-text-primary font-bold">Mode: No Form (Google Only)</p>
				<SignInUp
					mode="signin"
					hasForm={false}
					onGoogleClick="/auth/google"
					toggleLinkHref="#"
				/>
			</div>
		</div>
	);
}
