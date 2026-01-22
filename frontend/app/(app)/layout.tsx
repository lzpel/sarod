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
import { usePathname } from 'next/navigation';
import { Box, UserRound, Loader2 } from 'lucide-react';
import { useUser } from '@/app/Provider';
import Redirect from '@/stateless_ui/Redirect';
import Link from 'next/link';
import { SideLayout } from '@/stateless_ui/SideLayout';
import { Sushi3D } from '@/stateless_ui/Sushi3D';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { useQueryState } from 'nuqs';
import { pageApiGet, Page } from '@/src/out';


/**
 * 寿司のリンクを表示する内部コンポーネント
 */
function SushiNavLink(props: {
	href: string;
	label: string;
	toppingColor: string;
	isActive: boolean;
	model?: string;
	progress: number;
}) {
	return (
		<Link
			href={props.href}
			className={`relative block w-full h-48 transition-all overflow-hidden ${props.isActive
				? 'bg-action-selected/10 border-2 border-primary-main rounded-2xl'
				: 'hover:bg-action-hover/5 border-2 border-transparent rounded-2xl'
				}`}
		>
			<div className="absolute inset-0 pointer-events-none">
				<Canvas shadows>
					<PerspectiveCamera makeDefault position={[0, 1.8, 3]} fov={40} />
					<ambientLight intensity={0.7} />
					<Environment preset="city" />
					<Sushi3D toppingColor={props.toppingColor} model={props.model} scale={1.2} />
					<OrbitControls
						autoRotate
						autoRotateSpeed={1.0}
						enableZoom={false}
						enablePan={false}
						enableRotate={false}
						target={[0, 0.6, 0]}
					/>
				</Canvas>
			</div>
			{props.progress < 100 && (
				<div className="absolute inset-0 flex items-center justify-center bg-background-paper/40 backdrop-blur-[1px] z-20">
					<Loader2 className="w-8 h-8 text-primary-main animate-spin" />
				</div>
			)}
			<div className="relative z-10 flex items-end justify-center h-full p-2">
				<span className={`text-sm font-bold px-2 py-0.5 rounded-full bg-background-paper/60 backdrop-blur-sm ${props.isActive ? 'text-primary-main' : 'text-text-primary'}`}>
					{props.label}
				</span>
			</div>
		</Link>
	);
}

export default function Layout(props: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user, loading } = useUser();
	const [uuid, setUuid] = useQueryState("uuid", {});
	const [pages, setPages] = React.useState<Page[]>([]);

	const fetchPages = React.useCallback(() => {
		if (user) {
			pageApiGet().then(res => setPages(res.data));
		}
	}, [user]);

	// 初回取得
	React.useEffect(() => {
		fetchPages();
	}, [fetchPages]);

	// 条件付きポーリング: progress < 100 のページがある場合のみ10秒ごとに実行
	React.useEffect(() => {
		const hasIncomplete = pages.some(p => p.progress < 100);
		if (hasIncomplete) {
			const timer = setTimeout(fetchPages, 10000);
			return () => clearTimeout(timer);
		}
	}, [pages, fetchPages]);

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
				{pages.map((page) => (
					<SushiNavLink
						key={page.id}
						href={`/sushi?uuid=${page.id}`}
						label={page.name}
						toppingColor="#ff8c69"
						model={page.path_model ? `/api/auth/s/${page.path_model}` : undefined}
						progress={page.progress}
						isActive={pathname === '/sushi' && uuid === page.id}
					/>
				))}

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