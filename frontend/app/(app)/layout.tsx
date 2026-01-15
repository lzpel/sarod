//- TabsWithDataKey.tsxを用いて3D生成(/new)、ユーザー(/user)寿司A(/sushi?uuid=A)、寿司B(/sushi?uuid=B)を縦に並べて、またコンテンツはタブの右に接しています
//- リンクを用いて現在のタブを管理します
//- 左右はSideLayout.tsxを用いて構築します、タブの右にchildrenが入ります
//- 寿司のタブはタブボタンの中にSushi3Dを配置します
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは「外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止」「export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。」「app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。」
//以上の共通ルールは保持、共通ルール以降に内容を実装して
"use client";

import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, UserRound } from 'lucide-react';
import { useUser } from '@/app/Provider';
import Redirect from '@/stateless_ui/Redirect';
import Link from 'next/link';
import { SideLayout } from '@/stateless_ui/SideLayout';
import { Sushi3D } from '@/stateless_ui/Sushi3D';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';

export default function Layout(props: { children: React.ReactNode }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { user, loading } = useUser();

	// ① loading が最優先
	if (loading) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<div />
			</Suspense>
		);
	}

	// ② loading が終わってから user 判定
	if (!user) return <Redirect target="/" />;

	const uuid = searchParams.get('uuid');

	// サイドバーの内容
	const side = (
		<div className="flex flex-col h-full gap-4">
			{/* 1列目: グリッドレイアウト */}
			<div className="grid grid-cols-6 gap-2 flex-none">
				<Link
					href="/new"
					className={`col-span-3 flex flex-col items-center justify-center p-3 transition-all ${pathname === '/new'
						? 'bg-action-selected/20 border-2 border-primary-main rounded-xl'
						: 'hover:bg-action-hover/10 rounded-xl border-2 border-transparent'
						}`}
				>
					<Box size={24} className={pathname === '/new' ? 'text-primary-main' : 'text-text-secondary'} />
					<span className={`text-xs mt-1 font-bold ${pathname === '/new' ? 'text-primary-main' : 'text-text-primary'}`}>3D生成</span>
				</Link>
				<Link
					href="/user"
					className={`col-span-3 flex flex-col items-center justify-center p-3 transition-all ${pathname === '/user'
						? 'bg-action-selected/20 border-2 border-primary-main rounded-xl'
						: 'hover:bg-action-hover/10 rounded-xl border-2 border-transparent'
						}`}
				>
					<UserRound size={24} className={pathname === '/user' ? 'text-primary-main' : 'text-text-secondary'} />
					<span className={`text-xs mt-1 font-bold ${pathname === '/user' ? 'text-primary-main' : 'text-text-primary'}`}>ユーザー</span>
				</Link>
			</div>

			{/* 2列目以降: スクロール可能エリア */}
			<div className="flex-1 overflow-y-auto space-y-3 pr-1">
				<Link
					href="/sushi?uuid=A"
					className={`block w-full transition-all ${pathname === '/sushi' && uuid === 'A'
						? 'bg-action-selected/10 border-2 border-primary-main rounded-2xl'
						: 'hover:bg-action-hover/5 border-2 border-transparent rounded-2xl'
						}`}
				>
					<div className="flex flex-col items-center p-4">
						<div className="w-24 h-24">
							<Canvas shadows>
								<PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={40} />
								<ambientLight intensity={0.7} />
								<Environment preset="city" />
								<Sushi3D toppingColor="#ff4500" scale={1.2} rotation={[0.4, 0.8, 0]} />
							</Canvas>
						</div>
						<span className={`text-sm mt-1 font-bold ${pathname === '/sushi' && uuid === 'A' ? 'text-primary-main' : 'text-text-primary'}`}>寿司A</span>
					</div>
				</Link>

				<Link
					href="/sushi?uuid=B"
					className={`block w-full transition-all ${pathname === '/sushi' && uuid === 'B'
						? 'bg-action-selected/10 border-2 border-primary-main rounded-2xl'
						: 'hover:bg-action-hover/5 border-2 border-transparent rounded-2xl'
						}`}
				>
					<div className="flex flex-col items-center p-4">
						<div className="w-24 h-24">
							<Canvas shadows>
								<PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={40} />
								<ambientLight intensity={0.7} />
								<Environment preset="city" />
								<Sushi3D toppingColor="#ff8c69" scale={1.2} rotation={[0.4, 0.8, 0]} />
							</Canvas>
						</div>
						<span className={`text-sm mt-1 font-bold ${pathname === '/sushi' && uuid === 'B' ? 'text-primary-main' : 'text-text-primary'}`}>寿司B</span>
					</div>
				</Link>

				{/* デザイン確認用のプレースホルダー */}
				<div className="h-64 flex items-center justify-center text-text-secondary/20 border-2 border-dashed border-divider rounded-2xl italic">
					More sushi...
				</div>
			</div>
		</div>
	);

	// ③ 認証済み
	return (
		<SideLayout side={side}>
			{props.children}
		</SideLayout>
	);
}