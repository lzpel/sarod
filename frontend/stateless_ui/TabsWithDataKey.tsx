//- muiをtailwindに置き換える
//- children: React.ReactElement | React.ReactElement[];に主に複数のIconWithLabelが入りそれをタブとして一列に並べて表示する
//- contentSide?: 'top' | 'bottom' | 'left' | 'right'; 上下左右のいずれかにコンテンツが接している、それによって横一列に並べるのか縦一列に並べるのかが決まる
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//stateless_ui/以下のTsxに適用するルール
//- 外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止
//- export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。
//以上の共通ルールは保持、共通ルール以降に内容を実装して

import * as React from 'react';
import { withDataKey } from './withDataKey';
import IconWithLabel from './IconWithLabel';
import { Home, Settings, User } from 'lucide-react';

// TabsPanel Logic (Preserved and cleaned up)
type TabsPanelOwnProps<C extends React.ElementType> = {
	component?: C;
	value: string;
	children: React.ReactElement | React.ReactElement[];
};

type TabsPanelProps<C extends React.ElementType> =
	TabsPanelOwnProps<C> &
	Omit<
		React.ComponentPropsWithoutRef<C>,
		keyof TabsPanelOwnProps<C>
	>;

export function TabsPanel<C extends React.ElementType = "div">(
	props: TabsPanelProps<C>
) {
	const { component, children, value, ...rest } = props;
	const childrenArray = Array.isArray(children) ? children : [children];
	const Comp = (component ?? "div") as React.ElementType;
	return childrenArray.map(
		v =>
			<Comp
				key={v.key ?? undefined}
				{...(rest as React.ComponentPropsWithoutRef<C>)}
				style={{
					display: v.key === value ? "block" : "none",
					...(rest as any).style,
				}}
			>
				{v}
			</Comp>
	)
}

// TabsWithDataKey Logic
export type TabsWithDataKeyProps = {
	children: React.ReactElement | React.ReactElement[];
	contentSide?: 'top' | 'bottom' | 'left' | 'right';
	className?: string;
};

export default function TabsWithDataKey(props: TabsWithDataKeyProps) {
	const { children, contentSide = 'bottom', className } = props;
	const orientation = ['left', 'right'].includes(contentSide) ? 'vertical' : 'horizontal';
	const isVertical = orientation === 'vertical';
	const childrenArray = Array.isArray(children) ? children : [children];

	return (
		<div
			className={`flex ${isVertical ? 'flex-col' : 'flex-row'} ${className || ''}`}
			role="tablist"
			aria-orientation={orientation}
		>
			{childrenArray.map((child) => {
				if (!React.isValidElement(child)) return null;

				const props = (child as React.ReactElement<any>).props || {};

				// Handle divider (if it has role="separator" or is a specific type if needed)
				// For now, assuming explicit role="separator" or checking if it's not a tab item
				if (props.role === 'separator' || child.type === 'hr') {
					return (
						<div
							key={child.key}
							className={
								isVertical
									? 'h-[1px] w-full bg-divider my-2'
									: 'w-[1px] h-full bg-divider mx-2'
							}
							role="separator"
						/>
					);
				}

				const isSelected = props['aria-selected'] === true;

				let indicatorClass = "border-transparent";
				if (isSelected) {
					switch (contentSide) {
						case 'top': indicatorClass = "border-t-2 border-primary-main"; break;
						case 'bottom': indicatorClass = "border-b-2 border-primary-main"; break;
						case 'left': indicatorClass = "border-l-2 border-primary-main"; break;
						case 'right': indicatorClass = "border-r-2 border-primary-main"; break;
					}
				} else {
					switch (contentSide) {
						case 'top': indicatorClass = "border-t-2 border-transparent"; break;
						case 'bottom': indicatorClass = "border-b-2 border-transparent"; break;
						case 'left': indicatorClass = "border-l-2 border-transparent"; break;
						case 'right': indicatorClass = "border-r-2 border-transparent"; break;
					}
				}

				return (
					<div
						key={child.key}
						className={`
							${indicatorClass}
							${isSelected ? 'text-primary-main' : 'text-text-secondary'}
							hover:bg-action-hover/5
							transition-colors
							cursor-pointer
						`}
						role="tab"
					>
						{withDataKey(child, (child.key as string) || "null")}
					</div>
				);
			})}
		</div>
	);
}

/**
 * Example component
 */
export function Example() {
	// Static example with multiple tabs to demonstrate layout
	return (
		<div className="space-y-8 p-4 bg-background-default border border-divider">
			<div>
				<h3 className="mb-2 font-bold text-text-primary">Horizontal (Content Bottom)</h3>
				<div className="bg-background-paper border-b border-divider">
					<TabsWithDataKey contentSide="bottom">
						<IconWithLabel key="home" label="Home" icon={<Home size={20} />} aria-selected={true} />
						<div key="div1" role="separator" />
						<IconWithLabel key="profile" label="Profile" icon={<User size={20} />} />
						<IconWithLabel key="settings" label="Settings" icon={<Settings size={20} />} />
					</TabsWithDataKey>
				</div>
				<div className="p-4 bg-background-paper text-text-primary">
					Content for Home (Static)
				</div>
			</div>

			<div className="flex gap-4">
				<div className="w-1/3">
					<h3 className="mb-2 font-bold text-text-primary">Vertical (Content Left)</h3>
					<div className="flex bg-background-paper h-64 border border-divider">
						<div className="flex-1 p-4 text-text-primary">
							Content for Profile (Static)
						</div>
						<div className="border-l border-divider">
							<TabsWithDataKey contentSide="left">
								<IconWithLabel key="home" label="Home" icon={<Home size={20} />} />
								<IconWithLabel key="profile" label="Profile" icon={<User size={20} />} aria-selected={true} />
							</TabsWithDataKey>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}