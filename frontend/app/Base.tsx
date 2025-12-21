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
import TabsWithDataKey from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import { Home, Trophy, Star, User } from 'lucide-react';
import { useAuth } from '@/src/AuthProvider';
import Redirect from '@/stateless_ui/Redirect';
import { User as IAM } from '@/src/out';

export default function Base(props: {children: React.ReactNode}) {
	const {iam, loading} = useAuth();
	if (iam) {
		return <Suspense fallback={<div>Loading...</div>}>
			<BaseContent user={iam}>{props.children}</BaseContent>
		</Suspense>
	} else {
		return <Redirect target="/signin" />
	}
}

function BaseContent(props: {children: React.ReactNode, user: IAM}) {
	const [page, setPage] = useQueryState('page', parseAsString.withDefault('home'));

	const handleTabClick = (key: string) => {
		setPage(key);
	};

	return (
		<div className="flex flex-col h-screen w-full bg-background-default text-text-primary">
			<div className="flex-none border-b border-divider">
				<TabsWithDataKey contentSide="bottom" className="justify-center">
					<div
						key="home"
						onClick={() => handleTabClick('home')}
						aria-selected={page === 'home'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Home />} label="ホーム" />
					</div>
					<div
						key="ranking"
						onClick={() => handleTabClick('ranking')}
						aria-selected={page === 'ranking'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Trophy />} label="ランキング" />
					</div>
					<div
						key="star"
						onClick={() => handleTabClick('star')}
						aria-selected={page === 'star'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<Star />} label="スター" />
					</div>
					<div
						key="user"
						onClick={() => handleTabClick('user')}
						aria-selected={page === 'user'}
						className="flex justify-center"
					>
						<IconWithLabel icon={<User />} label="ユーザー" />
					</div>
				</TabsWithDataKey>
			</div>
			<div className="flex-1 overflow-auto">
				{props.children}
			</div>
		</div>
	);
}