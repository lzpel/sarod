import React from 'react';
import {
	Home, Search, Bell, Mail, User, MoreHorizontal,
	Feather, Image as ImageIcon, Smile, MapPin,
	MessageCircle, Repeat, Heart, BarChart2, Share
} from 'lucide-react';

export type TwitterUser = {
	name: string,
	picture: string,
	sub: string,
}
// --- モックデータ ---
const TWEETS = [
	{
		id: 1,
		name: "Taro Yamada",
		handle: "@taro_dev",
		time: "25分",
		content: "Next.jsとTailwind CSSの組み合わせ、開発体験が最高すぎる。🚀 #webdev #frontend",
		likes: 120,
		retweets: 14,
		replies: 5,
		views: "1.2k"
	},
	{
		id: 2,
		name: "Hanako Tech",
		handle: "@hanako_js",
		time: "2時間",
		content: "今日のお昼はラーメンでした🍜",
		image: "https://placehold.co/600x400/e2e8f0/475569?text=Ramen+Image",
		likes: 850,
		retweets: 200,
		replies: 45,
		views: "15k"
	},
	{
		id: 3,
		name: "Design Pro",
		handle: "@design_ui",
		time: "4時間",
		content: "UIデザインにおいて「余白」は単なる空白ではなく、要素同士の関係性を定義する重要な要素です。",
		likes: 432,
		retweets: 89,
		replies: 12,
		views: "5.6k"
	},
];

// --- コンポーネント ---

// 左サイドバー
const Sidebar = (props: {
	user: TwitterUser,
}) => (
	console.log(props.user),
	<div className="hidden sm:flex flex-col items-end xl:items-start w-20 xl:w-[275px] px-2 fixed h-screen overflow-y-auto border-r border-gray-100 z-10 bg-white">
		<div className="p-3 mb-2 xl:ml-0">
			{/* ロゴ (X / Twitter Bird) */}
			<div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">X</div>
		</div>

		<nav className="space-y-1 w-full">
			{[
				{ icon: Home, label: "ホーム", active: true },
				{ icon: Search, label: "話題を検索" },
				{ icon: Bell, label: "通知" },
				{ icon: Mail, label: "メッセージ" },
				{ icon: User, label: "プロフィール" },
				{ icon: MoreHorizontal, label: "もっと見る" },
			].map((item, idx) => (
				<a key={idx} href="#" className={`flex items-center gap-4 p-3 rounded-full w-max xl:w-full hover:bg-gray-100 transition-colors ${item.active ? 'font-bold' : ''}`}>
					<item.icon size={26} strokeWidth={item.active ? 3 : 2} />
					<span className="hidden xl:inline text-xl">{item.label}</span>
				</a>
			))}
		</nav>

		<button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 xl:py-3 xl:px-8 mt-4 w-max xl:w-[90%] font-bold shadow-md transition-all">
			<Feather className="block xl:hidden" />
			<span className="hidden xl:block">ツイートする</span>
		</button>

		<div className="mt-auto mb-4 p-3 hover:bg-gray-100 rounded-full w-full cursor-pointer flex items-center gap-3">
			<div className="w-10 h-10 bg-gray-300 rounded-full" >
				<img src={props.user.picture} alt="" />
			</div>
			<div className="hidden xl:block">
				<p className="font-bold text-sm">{props.user.name}</p>
				<p className="text-gray-500 text-sm">@{props.user.sub}</p>
			</div>
			<MoreHorizontal className="hidden xl:block ml-auto w-4 h-4" />
		</div>
	</div>
);

// ツイート投稿エリア
const TweetInput = () => (
	<div className="border-b border-gray-100 p-4 flex gap-4">
		<div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
		<div className="flex-1">
			<textarea
				className="w-full text-xl placeholder-gray-500 border-none focus:ring-0 resize-none outline-none mt-2"
				placeholder="いまどうしてる？"
				rows={2}
			/>
			<div className="flex items-center justify-between mt-2 border-t border-gray-50 pt-3">
				<div className="flex gap-2 text-blue-400">
					<ImageIcon size={20} className="cursor-pointer hover:bg-blue-50 rounded-full p-1 box-content" />
					<BarChart2 size={20} className="cursor-pointer hover:bg-blue-50 rounded-full p-1 box-content" />
					<Smile size={20} className="cursor-pointer hover:bg-blue-50 rounded-full p-1 box-content" />
					<MapPin size={20} className="cursor-pointer hover:bg-blue-50 rounded-full p-1 box-content" />
				</div>
				<button className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold text-sm opacity-50 cursor-not-allowed">
					ツイートする
				</button>
			</div>
		</div>
	</div>
);

// 個別のツイート
const Tweet = ({ data }: { data: any }) => (
	<div className="border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4">
		<div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
		<div className="flex-1 min-w-0">
			<div className="flex items-center gap-1 text-sm">
				<span className="font-bold truncate text-gray-900">{data.name}</span>
				<span className="text-gray-500 truncate">{data.handle}</span>
				<span className="text-gray-500">·</span>
				<span className="text-gray-500 hover:underline">{data.time}</span>
				<div className="ml-auto text-gray-400 hover:text-blue-400 hover:bg-blue-50 rounded-full p-1">
					<MoreHorizontal size={16} />
				</div>
			</div>

			<p className="text-gray-900 mt-1 whitespace-pre-wrap leading-normal">
				{data.content}
			</p>

			{data.image && (
				<div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
					<img src={data.image} alt="Tweet content" className="w-full h-auto object-cover" />
				</div>
			)}

			<div className="flex justify-between mt-3 text-gray-500 max-w-md">
				<div className="group flex items-center gap-2 hover:text-blue-500">
					<div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
						<MessageCircle size={18} />
					</div>
					<span className="text-xs">{data.replies}</span>
				</div>
				<div className="group flex items-center gap-2 hover:text-green-500">
					<div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
						<Repeat size={18} />
					</div>
					<span className="text-xs">{data.retweets}</span>
				</div>
				<div className="group flex items-center gap-2 hover:text-pink-500">
					<div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
						<Heart size={18} />
					</div>
					<span className="text-xs">{data.likes}</span>
				</div>
				<div className="group flex items-center gap-2 hover:text-blue-500">
					<div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
						<BarChart2 size={18} />
					</div>
					<span className="text-xs">{data.views}</span>
				</div>
				<div className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors">
					<Share size={18} />
				</div>
			</div>
		</div>
	</div>
);

// 右サイドバー (トレンド・おすすめユーザー)
const RightSidebar = () => (
	<div className="hidden lg:block w-[350px] pl-8 py-2 h-screen sticky top-0">
		{/* 検索バー */}
		<div className="sticky top-0 bg-white py-2 z-10">
			<div className="relative group">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500">
					<Search size={18} />
				</div>
				<input
					type="text"
					className="bg-gray-100 border-none text-gray-900 rounded-full py-3 pl-10 pr-4 block w-full focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder-gray-500"
					placeholder="キーワード検索"
				/>
			</div>
		</div>

		{/* トレンド */}
		<div className="bg-gray-50 rounded-2xl mt-4 pt-3 pb-1">
			<h2 className="font-bold text-xl px-4 pb-2">いまどうしてる？</h2>
			{[
				{ category: "日本のトレンド", word: "#Nextjs", posts: "12.5k posts" },
				{ category: "テクノロジー · トレンド", word: "Tailwind CSS", posts: "8,900 posts" },
				{ category: "政治 · トレンド", word: "選挙の日", posts: "50k posts" },
			].map((trend, i) => (
				<div key={i} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors relative">
					<div className="flex justify-between text-xs text-gray-500">
						<span>{trend.category}</span>
						<MoreHorizontal size={14} className="hover:text-blue-500" />
					</div>
					<p className="font-bold text-gray-900 mt-0.5">{trend.word}</p>
					<span className="text-xs text-gray-500">{trend.posts}</span>
				</div>
			))}
			<div className="p-4 text-blue-500 text-sm cursor-pointer hover:bg-gray-100 rounded-b-2xl">
				さらに表示
			</div>
		</div>

		{/* おすすめユーザー */}
		<div className="bg-gray-50 rounded-2xl mt-4 pt-3 pb-1">
			<h2 className="font-bold text-xl px-4 pb-2">おすすめユーザー</h2>
			{[1, 2].map((_, i) => (
				<div key={i} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-10 h-10 bg-gray-300 rounded-full" />
						<div>
							<p className="font-bold text-sm hover:underline">User Name</p>
							<p className="text-gray-500 text-sm">@username</p>
						</div>
					</div>
					<button className="bg-black hover:bg-gray-800 text-white text-sm font-bold py-1.5 px-4 rounded-full transition-colors">
						フォロー
					</button>
				</div>
			))}
			<div className="p-4 text-blue-500 text-sm cursor-pointer hover:bg-gray-100 rounded-b-2xl">
				さらに表示
			</div>
		</div>
	</div>
);

// --- メインレイアウト ---
export default function TwitterHome(props:
	{
		user: TwitterUser,
	}
) {
	return (
		<div className="min-h-screen bg-white text-gray-900 font-sans">
			<div className="max-w-[1265px] mx-auto flex justify-center">

				{/* Left Column (Navigation) */}
				<header className="flex-shrink-0 w-20 xl:w-[275px]">
					<Sidebar user={props.user} />
				</header>

				{/* Center Column (Feed) */}
				<main className="flex-grow max-w-[600px] border-r border-gray-100 min-h-screen">
					{/* Header */}
					<div className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-gray-100">
						<div className="px-4 py-3 cursor-pointer">
							<h1 className="text-lg font-bold">ホーム</h1>
						</div>
						<div className="flex">
							<div className="flex-1 hover:bg-gray-100 transition-colors cursor-pointer p-4 text-center font-bold border-b-4 border-blue-500">
								おすすめ
							</div>
							<div className="flex-1 hover:bg-gray-100 transition-colors cursor-pointer p-4 text-center text-gray-500 font-medium">
								フォロー中
							</div>
						</div>
					</div>

					{/* Post Input */}
					<TweetInput />

					{/* Tweets Stream */}
					<div>
						{TWEETS.map(tweet => (
							<Tweet key={tweet.id} data={tweet} />
						))}
					</div>
				</main>

				{/* Right Column (Widgets) */}
				<aside className="hidden lg:block w-[350px]">
					<RightSidebar />
				</aside>

			</div>
		</div>
	);
}