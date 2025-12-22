//- TabsWithDataKey.tsxを用いてホーム、ランキング、スター、ユーザーの四つを横に並べて、またコンテンツはタブの下に接しています
//- nuqsを用いて現在のタブを管理します
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

import React, { Suspense } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import TabsWithDataKey, { TabsPanel } from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import { Home, Trophy, Star, UserRound } from 'lucide-react';
import Redirect from '@/stateless_ui/Redirect';
import { useUser, User } from './Provider';
import { GetDataKeyFromEvent } from '@/stateless_ui/withDataKey';

export default function Base(props: {children: React.ReactElement[]}) {
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
	return <BaseContent user={user}>
		{props.children}
	</BaseContent>
}

function BaseContent(props: {children: React.ReactElement[], user: User}) {
	const [page, setPage] = useQueryState('page', parseAsString.withDefault('home'));

	return (
		<div className="flex flex-col h-screen w-full bg-background-default text-text-primary">
			<div className="flex-none border-b border-divider">
				<TabsWithDataKey contentSide="bottom" className="justify-center" onClick={(e)=>setPage(GetDataKeyFromEvent(e)||page)}>
					<div
						key="home"
						aria-selected={page === 'home'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Home />} label="ホーム" />
					</div>
					<div
						key="ranking"
						aria-selected={page === 'ranking'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Trophy />} label="ランキング" />
					</div>
					<div
						key="star"
						aria-selected={page === 'star'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Star />} label="スター" />
					</div>
					<div
						key="user"
						aria-selected={page === 'user'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<UserRound />} label="ユーザー" />
					</div>
				</TabsWithDataKey>
			</div>
			<TabsPanel component="div" value={page} className="flex-1 overflow-auto">
				<div key="home">home</div>
				<div key="ranking">ranking</div>
				<div key="star">star</div>
				<div key="user">user</div>
			</TabsPanel>
		</div>
	);
}