//- export default function IconWithLabel()を定義して、文字列とラベルを指定できる
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

import React, { ReactNode } from 'react';
import { Settings, Home, User, Bell } from 'lucide-react';

type IconWithLabelProps = {
	/** 表示するアイコン (ReactNode) */
	icon: ReactNode;
	/** 表示するラベルテキスト */
	label: string;
	/** 追加のCSSクラス */
	className?: string;
	/** クリックハンドラ */
	onClick?: () => void;
	/** 選択状態 (Tabsなどで使用) */
	"aria-selected"?: boolean;
};

/**
 * アイコンとラベルを横並びに表示するコンポーネント
 */

export default function IconWithLabel(props: IconWithLabelProps) {
	return (
		<div
			className={`flex items-center justify-center gap-3 py-4 px-6 ${props.onClick
				? "cursor-pointer rounded hover:bg-action-hover/10 transition-colors"
				: ""
				} ${props.className || ""}`}
			onClick={props.onClick}
		>
			<span className="text-text-secondary flex items-center justify-center">
				{props.icon}
			</span>
			<span className="text-base font-medium text-text-primary">
				{props.label}
			</span>
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	return (
		<div className="p-4 space-y-4 bg-background-paper border border-divider rounded max-w-md">
			<h3 className="font-bold text-text-primary border-b border-divider pb-2">
				IconWithLabel Examples
			</h3>

			<div className="flex flex-col gap-2">
				<IconWithLabel
					icon={<Home size={20} />}
					label="ホーム (Default)"
				/>
				<IconWithLabel
					icon={<Bell size={20} />}
					label="通知 (Clickable)"
				/>
				<IconWithLabel
					icon={<Settings size={20} />}
					label="設定 (Custom Class)"
					className="bg-primary-main/10 border border-primary-main/20 rounded-lg p-2"
				/>
				<div className="flex gap-4 border-t border-divider pt-2">
					<IconWithLabel icon={<User size={16} />} label="User" />
					<IconWithLabel icon={<Settings size={16} />} label="Config" />
				</div>
			</div>
		</div>
	);
}