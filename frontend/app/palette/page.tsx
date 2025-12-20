export default function PaletteTestPage() {
	return (
		<main className="min-h-dvh bg-background-default text-text-primary">
			{/* Header */}
			<header className="sticky top-0 z-10 border-b border-divider bg-background-paper/90 backdrop-blur">
				<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded bg-primary-main" />
						<div>
							<div className="text-sm font-semibold">Palette Test</div>
							<div className="text-xs text-text-secondary">
								Tailwind colors mapped to CSS variables
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<a
							className="rounded-md border border-divider bg-background-paper px-3 py-2 text-sm hover:bg-action-hover/10"
							href="#"
						>
							Link (hover)
						</a>
						<button className="rounded-md bg-primary-main px-3 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-dark">
							Primary
						</button>
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
				{/* Mode note */}
				<section className="rounded-xl border border-divider bg-background-paper p-6">
					<h1 className="text-xl font-bold">確認ポイント</h1>
					<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-secondary">
						<li>
							背景が <code className="rounded bg-action-hover/10 px-1">bg-background-default</code>{" "}
							の色になっている
						</li>
						<li>
							カードが <code className="rounded bg-action-hover/10 px-1">bg-background-paper</code>{" "}
							になっている
						</li>
						<li>
							罫線が <code className="rounded bg-action-hover/10 px-1">border-divider</code>{" "}
							で出る
						</li>
						<li>
							Hover が <code className="rounded bg-action-hover/10 px-1">hover:bg-action-hover/10</code>{" "}
							で白/黒のオーバーレイになる
						</li>
					</ul>

					<div className="mt-5 flex flex-wrap gap-2">
						<button className="rounded-md border border-divider bg-background-paper px-3 py-2 text-sm hover:bg-action-hover/10">
							Hover overlay
						</button>
						<button className="rounded-md border border-divider bg-action-hover/10 px-3 py-2 text-sm">
							bg-action-hover/10
						</button>
						<button className="rounded-md border border-divider bg-action-hover/20 px-3 py-2 text-sm">
							bg-action-hover/20
						</button>
						<button className="rounded-md border border-divider bg-action-hover/30 px-3 py-2 text-sm">
							bg-action-hover/30
						</button>
						<button className="rounded-md border border-divider bg-action-hover/40 px-3 py-2 text-sm">
							bg-action-hover/40
						</button>
					</div>
				</section>

				{/* Tone swatches */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Tones</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<ToneCard name="primary" main="bg-primary-main" contrast="text-primary-contrast" darkHover="hover:bg-primary-dark" light="bg-primary-light" dark="bg-primary-dark" />
						<ToneCard name="secondary" main="bg-secondary-main" contrast="text-secondary-contrast" darkHover="hover:bg-secondary-dark" light="bg-secondary-light" dark="bg-secondary-dark" />
						<ToneCard name="error" main="bg-error-main" contrast="text-error-contrast" darkHover="hover:bg-error-dark" light="bg-error-light" dark="bg-error-dark" />
						<ToneCard name="warning" main="bg-warning-main" contrast="text-warning-contrast" darkHover="hover:bg-warning-dark" light="bg-warning-light" dark="bg-warning-dark" />
						<ToneCard name="info" main="bg-info-main" contrast="text-info-contrast" darkHover="hover:bg-info-dark" light="bg-info-light" dark="bg-info-dark" />
						<ToneCard name="success" main="bg-success-main" contrast="text-success-contrast" darkHover="hover:bg-success-dark" light="bg-success-light" dark="bg-success-dark" />
					</div>
				</section>

				{/* Text / background / divider */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Text / Background / Divider</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-xl border border-divider bg-background-paper p-6">
							<div className="text-sm font-semibold text-text-primary">text.primary</div>
							<p className="mt-2 text-sm text-text-secondary">
								これは <code className="rounded bg-action-hover/10 px-1">text-text-secondary</code>{" "}
								のサンプルです。カードは{" "}
								<code className="rounded bg-action-hover/10 px-1">bg-background-paper</code>。
							</p>
							<p className="mt-3 text-sm text-text-disabled">
								これは disabled テキスト（text-text-disabled）です。
							</p>

							<div className="mt-5 flex gap-2">
								<button className="rounded-md border border-divider bg-background-paper px-3 py-2 text-sm hover:bg-action-hover/10">
									Neutral
								</button>
								<button
									className="rounded-md bg-primary-main px-3 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-dark disabled:bg-action-disabledBackground disabled:text-text-disabled"
									disabled
								>
									Disabled
								</button>
							</div>
						</div>

						<div className="rounded-xl border border-divider bg-background-paper p-6">
							<div className="text-sm font-semibold">Border & Divider</div>
							<div className="mt-4 space-y-3">
								<div className="h-px bg-divider" />
								<div className="rounded-md border border-divider p-3 text-sm text-text-secondary">
									border-divider が効いていれば、この枠線がテーマ色になります。
								</div>
								<div className="h-px bg-divider" />
								<div className="text-sm text-text-secondary">
									divider を背景として使う場合は <code className="rounded bg-action-hover/10 px-1">bg-divider</code>{" "}
									を使います（tailwind 側で divider を colors として定義しているため）。
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Dark mode instruction */}
				<section className="rounded-xl border border-divider bg-background-paper p-6">
					<h2 className="text-lg font-semibold">Dark mode 切替の確認</h2>
					<p className="mt-2 text-sm text-text-secondary">
						<code className="rounded bg-action-hover/10 px-1">html</code> または{" "}
						<code className="rounded bg-action-hover/10 px-1">body</code> に{" "}
						<code className="rounded bg-action-hover/10 px-1">class="dark"</code> を付けると、
						背景が #0f0f0f 系に変わり、hover のオーバーレイが白寄りになるはずです。
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						<div className="rounded-md bg-background-default px-3 py-2 text-sm text-text-secondary">
							bg-background-default
						</div>
						<div className="rounded-md bg-background-paper px-3 py-2 text-sm text-text-secondary">
							bg-background-paper
						</div>
						<div className="rounded-md bg-secondary-main px-3 py-2 text-sm text-secondary-contrast">
							bg-secondary-main
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

function ToneCard(props: {
	name: string;
	main: string;
	contrast: string;
	darkHover: string;
	light: string;
	dark: string;
}) {
	return (
		<div className="rounded-xl border border-divider bg-background-paper p-5">
			<div className="text-sm font-semibold">{props.name}</div>

			<div className="mt-4 grid grid-cols-3 gap-2">
				<div className={`h-10 rounded ${props.light}`} title="light" />
				<div className={`h-10 rounded ${props.main}`} title="main" />
				<div className={`h-10 rounded ${props.dark}`} title="dark" />
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					className={[
						"rounded-md px-3 py-2 text-sm font-semibold",
						props.main,
						props.contrast,
						props.darkHover,
					].join(" ")}
				>
					{props.name} button
				</button>

				<button className="rounded-md border border-divider bg-background-paper px-3 py-2 text-sm hover:bg-action-hover/10">
					neutral hover
				</button>
			</div>

			<p className="mt-3 text-sm text-text-secondary">
				hover を <code className="rounded bg-action-hover/10 px-1">{props.darkHover}</code> と{" "}
				<code className="rounded bg-action-hover/10 px-1">hover:bg-action-hover/10</code> で比較してください。
			</p>
		</div>
	);
}
