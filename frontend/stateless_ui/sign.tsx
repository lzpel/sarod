export default function Sign(props: {auth_uri: string, redirect_uri: string}){
	return <main className="flex-1 flex items-center justify-center px-4 pb-16">
		<div className="w-full max-w-4xl grid gap-10 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] items-center">
			<section>
				<p className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-200 mb-4">
					<span className="mr-1">●</span> 数分で始められるクラウドサービス
				</p>
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
					Email / Google で<br />
					すぐにアカウント作成
				</h1>
				<p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
					メールアドレスとパスワード、または Google アカウントで
					簡単にアカウントを作成できます。	
					サインアップは無料、いつでもキャンセル可能です。
				</p>
				<ul className="space-y-2 text-sm text-slate-300 mb-6">
					<li className="flex items-start gap-2">
						<span className="mt-1 h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-200">✓</span>
						<span>パスワードは安全にハッシュ化して保存</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-200">✓</span>
						<span>Google 連携で数秒で登録完了</span>
					</li>
					<li className="flex items-start gap-2">
						<span className="mt-1 h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-200">✓</span>
						<span>無料プランからすぐに試せます</span>
					</li>
				</ul>
				<p className="text-xs text-slate-400">
					アカウント作成ボタンを押すことで、
					<a href="#" className="underline decoration-slate-500 hover:text-slate-200">利用規約</a> と
					<a href="#" className="underline decoration-slate-500 hover:text-slate-200">プライバシーポリシー</a> に同意したものとみなされます。
				</p>
			</section>
			<section>
				<div className="bg-slate-900/80 border border-slate-700/80 shadow-xl shadow-slate-900/40 rounded-2xl p-6 md:p-7 backdrop-blur">
					<h2 className="text-xl font-semibold mb-1">アカウントを作成</h2>
					<p className="text-xs text-slate-400 mb-4">
						メールアドレスとパスワード、または Google アカウントで登録できます。
					</p>

					<form
						action={props.auth_uri}
						method="get"
						className="mb-5"
					>
						<input hidden name="redirect" value={props.redirect_uri}/>
						<button
							type="submit"
							className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
						>
							<span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white">
								<span className="text-[11px] font-bold text-slate-900">G</span>
							</span>
							<span>Google アカウントで続行</span>
						</button>
					</form>
					<div className="relative flex items-center mb-5">
						<div className="flex-1 border-t border-slate-700"></div>
						<span className="mx-3 text-[10px] uppercase tracking-[0.15em] text-slate-500">または</span>
						<div className="flex-1 border-t border-slate-700"></div>
					</div>
					<form
						action="/auth/signup"
						method="post"
						className="space-y-4"
					>
						<div className="space-y-1.5">
							<label className="block text-xs font-medium text-slate-200">
								メールアドレス
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								autoComplete="email"
								className="block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
								placeholder="you@example.com"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-medium text-slate-200">
								パスワード
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								minLength={8}
								autoComplete="new-password"
								className="block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
								placeholder="8文字以上で入力してください"
							/>
							<p className="text-[11px] text-slate-500">
								英数字と記号を組み合わせると、より安全になります。
							</p>
						</div>

						<div className="space-y-1.5">
							<label className="block text-xs font-medium text-slate-200">
								表示名（任意）
							</label>
							<input
								id="name"
								name="display_name"
								type="text"
								autoComplete="nickname"
								className="block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
								placeholder="Your name"
							/>
						</div>

						<div className="flex items-center gap-2 text-xs text-slate-400">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								required
								className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
							/>
							<label className="select-none">
								利用規約とプライバシーポリシーに同意します。
							</label>
						</div>

						<button
							type="submit"
							className="w-full inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
						>
							メールアドレスでアカウント作成
						</button>
					</form>

					<p className="mt-4 text-xs text-slate-400 text-center">
						すでにアカウントをお持ちですか？
						<a href="/login" className="text-sky-400 hover:text-sky-300 underline">
							ログインはこちら
						</a>
					</p>
				</div>
			</section>
		</div>
	</main>
}