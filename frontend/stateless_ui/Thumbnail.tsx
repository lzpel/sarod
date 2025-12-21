//- 動画のサムネイルを全体の長さとタイトル付きで表示するコンポーネントです。
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

import React from 'react';
import { Play } from 'lucide-react';

type ThumbnailProps = {
	/** 画像のURL */
	imageSrc: string;
	/** 動画のタイトル */
	title: string;
	/** 動画の長さ (例: "12:34") */
	duration: string;
	/** クリックハンドラ */
	onClick?: () => void;
	/** 追加のCSSクラス */
	className?: string;
};

/**
 * 動画のサムネイルを表示するコンポーネント
 * 画像、動画の長さ、タイトルを表示します
 */
export default function Thumbnail(props: ThumbnailProps) {
	return (
		<div
			className={`group relative flex flex-col gap-2 w-full max-w-[320px] ${props.onClick ? "cursor-pointer" : ""} ${props.className || ""}`}
			onClick={props.onClick}
		>
			{/* サムネイル画像コンテナ */}
			<div className="relative aspect-video w-full overflow-hidden rounded-xl bg-background-paper shadow-sm transition-all duration-300 group-hover:rounded-none group-hover:scale-105 group-hover:shadow-md z-0 group-hover:z-10">
				{props.imageSrc ? (
					<img
						src={props.imageSrc}
						alt={props.title}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-action-disabledBackground text-text-disabled">
						<Play size={32} />
					</div>
				)}

				{/* 動画の長さバッジ */}
				<div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded font-medium">
					{props.duration}
				</div>

				{/* ホバー時のオーバーレイ (オプション) */}
				<div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
			</div>

			{/* タイトル */}
			<div className="flex flex-col gap-1 px-1">
				<h3 className="font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-primary-main transition-colors">
					{props.title}
				</h3>
			</div>
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	return (
		<div className="p-4 space-y-8 bg-background-paper border border-divider rounded">
			<h3 className="font-bold text-text-primary border-b border-divider pb-2">
				Thumbnail Examples
			</h3>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Thumbnail
					imageSrc="https://picsum.photos/seed/1/320/180"
					title="自然の驚異的な風景：4Kドキュメンタリー"
					duration="12:34"
				/>
				<Thumbnail
					imageSrc="https://picsum.photos/seed/2/320/180"
					title="プログラミング入門：Reactの使い方を10分で解説"
					duration="10:05"
				/>
				<Thumbnail
					imageSrc=""
					title="画像なしの場合のプレースホルダー表示テスト"
					duration="05:20"
				/>
				<Thumbnail
					imageSrc="https://picsum.photos/seed/3/320/180"
					title="非常に長いタイトルを持つ動画のテスト。このテキストは2行まで表示され、それ以降は省略記号（...）で省略されるべきです。"
					duration="1:23:45"
				/>
			</div>
		</div>
	);
}
