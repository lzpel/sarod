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

import { Trophy, Film, History, Star, LogOut, BadgeJapaneseYen, BadgeDollarSign } from 'lucide-react';
import TabsWithDataKey, { TabsPanel } from '@/stateless_ui/TabsWithDataKey';
import IconWithLabel from '@/stateless_ui/IconWithLabel';
import Thumbnail from '@/stateless_ui/Thumbnail';
import { authApiOut } from '@/src/out';
import { GetDataKeyFromEvent } from '@/stateless_ui/withDataKey';
import { useQueryState } from 'nuqs';
import { Subscription } from '@/stateless_ui/Subscription';


export default function Page() {
	const userTabDefault="ranking";
	const [userTab, setUserTab] = useQueryState('user_tab', {
		defaultValue: userTabDefault,
	});

	return (
		<div className="flex h-full w-full bg-background-default">
			{/* 左カラム: タブ */}
			<div className="flex-none w-64 border-r border-divider h-full bg-background-paper">
				<TabsWithDataKey
					contentSide="right"
					className="h-full bg-transparent"
					onClick={(e: React.MouseEvent) => setUserTab(GetDataKeyFromEvent(e) ?? userTabDefault)}
				>
					<IconWithLabel
						key="ranking"
						icon={<Trophy size={24} />}
						label="ランキング"
						aria-selected={userTab === 'ranking'}
						className="justify-start"
					/>
					<IconWithLabel
						key="latest"
						icon={<Film size={24} />}
						label="最新動画"
						aria-selected={userTab === 'latest'}
						className="justify-start"
					/>
					<IconWithLabel
						key="history"
						icon={<History size={24} />}
						label="視聴履歴"
						aria-selected={userTab === 'history'}
						className="justify-start"
					/>
					<IconWithLabel
						key="likes"
						icon={<Star size={24} />}
						label="高評価"
						aria-selected={userTab === 'likes'}
						className="justify-start"
					/>
					<IconWithLabel
						key="subscription"
						icon={<CurrencyIcon size={24} />}
						label="無制限版"
						aria-selected={userTab === 'subscription'}
						className="justify-start"
					/>
					<IconWithLabel
						key="logout"
						icon={<LogOut size={24} />}
						label="ログアウト"
						onClick={() => authApiOut().then(() =>  window.location.reload())}
						className="justify-start"
					/>
				</TabsWithDataKey>
			</div>

			{/* 右カラム: コンテンツ */}
			<TabsPanel className="flex-1 overflow-auto p-6" value={userTab}>
				<Subscription key="subscription"
					title="Upgrade to Premium"
					description="コンテンツ制作を楽しみ、収益化するための最適なプランをお選びください。"
					saveLabel="SAVE 12%"
					value="free"
					plans={[
						{
							value: "free",
							title: "Free",
							priceAnnual: 0,
							priceMonthly: 0,
							currency: "yen",
							features: [
								"無料プラン",
								"月額無料",
								"年額無料",
								"動画のアップロード制限あり",
								"オリジナルステッカー制限あり"
							]
						},
						{
							value: "unlimited",
							title: "Unlimited",
							priceAnnual: 980,
							priceMonthly: 980,
							currency: "yen",
							features: [
								"Unlimitedプラン",
								"月額980円",
								"年額980円",
								"動画のアップロード制限なし",
								"オリジナルステッカー制限なし"
							]
						}
					]}
				/>	
			</TabsPanel>
		</div>
	);
}

function CurrencyIcon(props:  React.ComponentProps<typeof BadgeDollarSign>) {
	if (typeof navigator !== "undefined") {
		const lang = navigator.language.toLowerCase();
		if (lang.startsWith("ja")) {
		return <BadgeJapaneseYen {...props} />;
		}
	}
	return <BadgeDollarSign {...props} />;
}