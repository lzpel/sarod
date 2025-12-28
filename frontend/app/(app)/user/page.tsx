//- 左側にTabsWithDataKey.tsx（縦型）（ランキング、最新動画などのタブをIconWithLabelで構築）右側にThumbnail.tsxをいくつか配置する
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

import React, { useState } from 'react';
import { Trophy, Film, History, Star } from 'lucide-react';
import TabsWithDataKey from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import Thumbnail from '@/stateless_ui/Thumbnail';

// ダミーデータ
const DUMMY_VIDEOS = {
	ranking: Array.from({ length: 8 }).map((_, i) => ({
		id: `rank-${i}`,
		imageSrc: `https://picsum.photos/seed/rank${i}/320/180`,
		title: `ランキング動画タイトル ${i + 1} - 人気上昇中のコンテンツ`,
		duration: '10:00'
	})),
	latest: Array.from({ length: 8 }).map((_, i) => ({
		id: `latest-${i}`,
		imageSrc: `https://picsum.photos/seed/latest${i}/320/180`,
		title: `最新動画タイトル ${i + 1} - アップロードされたばかり`,
		duration: '05:30'
	})),
	history: Array.from({ length: 8 }).map((_, i) => ({
		id: `hist-${i}`,
		imageSrc: `https://picsum.photos/seed/hist${i}/320/180`,
		title: `視聴履歴動画タイトル ${i + 1} - 以前視聴した動画`,
		duration: '15:20'
	})),
	likes: Array.from({ length: 8 }).map((_, i) => ({
		id: `like-${i}`,
		imageSrc: `https://picsum.photos/seed/like${i}/320/180`,
		title: `高評価動画タイトル ${i + 1} - お気に入りのコンテンツ`,
		duration: '08:45'
	})),
};

export default function Page() {
	const [activeTab, setActiveTab] = useState<keyof typeof DUMMY_VIDEOS>('ranking');

	const handleTabClick = (key: string) => {
		if (key in DUMMY_VIDEOS) {
			setActiveTab(key as keyof typeof DUMMY_VIDEOS);
		}
	};

	const videos = DUMMY_VIDEOS[activeTab] || [];

	return (
		<div className="flex h-full w-full bg-background-default">
			{/* 左カラム: タブ */}
			<div className="flex-none w-64 border-r border-divider h-full bg-background-paper p-4">
				<TabsWithDataKey
					contentSide="right"
					className="h-full bg-transparent"
				>
					<IconWithLabel
						key="ranking"
						icon={<Trophy size={24} />}
						label="ランキング"
						aria-selected={activeTab === 'ranking'}
						onClick={() => handleTabClick('ranking')}
						className="justify-start px-4"
					/>
					<IconWithLabel
						key="latest"
						icon={<Film size={24} />}
						label="最新動画"
						aria-selected={activeTab === 'latest'}
						onClick={() => handleTabClick('latest')}
						className="justify-start px-4"
					/>
					<IconWithLabel
						key="history"
						icon={<History size={24} />}
						label="視聴履歴"
						aria-selected={activeTab === 'history'}
						onClick={() => handleTabClick('history')}
						className="justify-start px-4"
					/>
					<IconWithLabel
						key="likes"
						icon={<Star size={24} />}
						label="高評価"
						aria-selected={activeTab === 'likes'}
						onClick={() => handleTabClick('likes')}
						className="justify-start px-4"
					/>
				</TabsWithDataKey>
			</div>

			{/* 右カラム: コンテンツ */}
			<div className="flex-1 overflow-auto p-6">
				<h2 className="text-2xl font-bold text-text-primary mb-6">
					{activeTab === 'ranking' && 'ランキング'}
					{activeTab === 'latest' && '最新動画'}
					{activeTab === 'history' && '視聴履歴'}
					{activeTab === 'likes' && '高評価'}
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{videos.map((video) => (
						<Thumbnail
							key={video.id}
							imageSrc={video.imageSrc}
							title={video.title}
							duration={video.duration}
							className="w-full max-w-none"
						/>
					))}
				</div>
			</div>
		</div>
	);
}