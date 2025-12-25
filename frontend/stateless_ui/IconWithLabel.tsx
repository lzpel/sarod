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

type IconWithLabelOwnProps<C extends React.ElementType> = {
	/** 表示するアイコン (ReactNode) */
	icon: ReactNode;
	/** 表示するラベルテキスト */
	label: string;
	/** 選択状態 (Tabsなどで使用) */
	"aria-selected"?: boolean;
	disabled?: boolean;
	component?: C
}

type IconWithLabelProps<C extends React.ElementType> =
	IconWithLabelOwnProps<C> &
	Omit<
		React.ComponentPropsWithoutRef<C>,
		keyof IconWithLabelOwnProps<C>
	>;

/**
 * アイコンとラベルを横並びに表示するコンポーネント
 */

export default function IconWithLabel<C extends React.ElementType = "div">(
	props: IconWithLabelProps<C>
) {
	const { component, icon, label, "aria-selected": ariaSelected, disabled, className, ...rest } = props;
	const Component = (component || "div") as React.ElementType;
	return (
		<Component
			className={`
				flex items-center w-full justify-center gap-3 py-4 px-6
				${disabled ? "" : "cursor-pointer rounded hover:bg-action-hover/10 transition-colors"}
				${className ?? ""}
			`}
			{...rest}
		>
			<span className="text-text-secondary flex items-center justify-center">
				{icon}
			</span>
			<span className="text-base font-medium text-text-primary">
				{label}
			</span>
		</Component>
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

			<div className="flex flex-col gap-4">
				{/* Default (div) */}
				<div>
					<div className="text-xs text-text-secondary mb-1">Default (div)</div>
					<IconWithLabel
						icon={<Home size={20} />}
						label="ホーム"
					/>
				</div>

				{/* As Button */}
				<div>
					<div className="text-xs text-text-secondary mb-1">As Button</div>
					<IconWithLabel
						component="button"
						icon={<Bell size={20} />}
						label="ボタンとして機能"
						className="border border-divider"
					/>
				</div>

				{/* Disabled */}
				<div>
					<div className="text-xs text-text-secondary mb-1">Disabled</div>
					<IconWithLabel
						disabled
						icon={<Settings size={20} />}
						label="無効化"
					/>
				</div>

				{/* Selected State */}
				<div>
					<div className="text-xs text-text-secondary mb-1">Selected</div>
					<IconWithLabel
						aria-selected={true}
						icon={<User size={20} />}
						label="選択中"
						className="bg-action-selected/10 text-primary-main"
					/>
				</div>
			</div>
		</div>
	);
}