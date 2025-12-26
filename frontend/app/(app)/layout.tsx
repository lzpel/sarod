//- TabsWithDataKey.tsxを用いてホーム、ランキング、スター、ユーザーの四つを横に並べて、またコンテンツはタブの下に接しています
//- リンクを用いて現在のタブを管理します
//- タブの下にheight:100%の領域がありそこにchildrenが入ります
//- TabsWithDataKeyのclassNameを用いてタブを中央に寄せて、またタブ(frontend\stateless_ui\IconWithLabel.tsx)を大きめにし、間隔を広げます
//- area-selectedをパスに合わせてIconWithLabelに設定して
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

import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabsWithDataKey from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import { Home, Trophy, Star, UserRound } from 'lucide-react';
import { useUser } from '@/app/Provider';
import Redirect from '@/stateless_ui/Redirect';

export default function Layout(props: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user, loading } = useUser();
	// ① loading が最優先
	if (loading) {
		return <Suspense fallback={<div>Loading...</div>}>
			<div />
		</Suspense>;
	}
	// ② loading が終わってから user 判定
	if (!user) return <Redirect target="/signin" />;
	// ③ 認証済み
	return (
		<div className="flex flex-col h-screen w-full bg-background-default text-text-primary">
			<div className="flex-none border-b border-divider">
				<TabsWithDataKey
					contentSide="bottom"
					className="justify-center"
				>
					<IconWithLabel
						key="home"
						icon={<Home size={28} />}
						component='a'
						label="ホーム"
						className="px-6 py-3"
						href="/home"
						aria-selected={pathname.startsWith('/home')}
					/>
					<IconWithLabel
						key="ranking"
						icon={<Trophy size={28} />}
						component='a'
						label="ランキング"
						className="px-6 py-3"
						href="/ranking"
						aria-selected={pathname.startsWith('/ranking')}
					/>
					<IconWithLabel
						key="star"
						icon={<Star size={28} />}
						component='a'
						label="課題"
						className="px-6 py-3"
						href="/star"
						aria-selected={pathname.startsWith('/star')}
					/>
					<IconWithLabel
						key="user"
						icon={<UserRound size={28} />}
						component='a'
						label="ユーザー"
						className="px-6 py-3"
						href="/user"
						aria-selected={pathname.startsWith('/user')}
					/>
				</TabsWithDataKey>
			</div>

			<div className="flex-1 overflow-auto h-full">
				{props.children}
			</div>
		</div>
	);
}