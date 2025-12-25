//- TabsWithDataKey.tsxを用いてホーム、ランキング、スター、ユーザーの四つを横に並べて、またコンテンツはタブの下に接しています
//- リンクを用いて現在のタブを管理します
//- タブの下にheight:100%の領域がありそこにchildrenが入ります
//- TabsWithDataKeyのclassNameを用いてタブを中央に寄せて、またタブ(frontend\stateless_ui\IconWithLabel.tsx)を大きめにし、間隔を広げます
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

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabsWithDataKey from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import { Home, Trophy, Star, UserRound } from 'lucide-react';
import { WithDataKey, GetDataKeyFromEvent } from '@/stateless_ui/withDataKey';

export default function Layout(props: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	// パス名から現在のアクティブなタブを判定
	const getActiveTab = (path: string) => {
		if (path.includes('/ranking')) return 'ranking';
		if (path.includes('/star')) return 'star';
		if (path.includes('/user')) return 'user';
		if (path.includes('/home')) return 'home';
		return 'home'; // デフォルト
	};

	const activeTab = getActiveTab(pathname);

	const handleTabClick = (e: React.MouseEvent<HTMLElement>) => {
		const key = GetDataKeyFromEvent(e);
		console.log(key);
		if (key) {
			router.push(`/${key}`);
		}
	};

	return (
		<div className="flex flex-col h-screen w-full bg-background-default text-text-primary">
			<div className="flex-none border-b border-divider">
				<TabsWithDataKey
					contentSide="bottom"
					className="justify-center"
					onClick={handleTabClick}
				>
					<WithDataKey dataKey="home">
						<IconWithLabel
							icon={<Home size={28} />}
							label="ホーム"
							className="px-6 py-3"
							selectable
						/>
					</WithDataKey>
					<WithDataKey dataKey="ranking">
						<IconWithLabel
							icon={<Trophy size={28} />}
							label="ランキング"
							className="px-6 py-3"
							selectable
						/>
					</WithDataKey>
					<WithDataKey dataKey="star">
						<IconWithLabel
							icon={<Star size={28} />}
							label="課題"
							className="px-6 py-3"
							selectable
						/>
					</WithDataKey>
					<WithDataKey dataKey="user">
						<IconWithLabel
							icon={<UserRound size={28} />}
							label="ユーザー"
							className="px-6 py-3"
							selectable
						/>
					</WithDataKey>
				</TabsWithDataKey>
			</div>

			<div className="flex-1 overflow-auto h-full">
				{props.children}
			</div>
		</div>
	);
}