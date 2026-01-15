//- @react-three/fiberで皿の上にサーモンの寿司が入っている部品を書いて
//全体ルール：
//- UI部品はexport function/export default functionで構築、constに関数を入れるのは禁止
//- ... function ... (props: ...){ props.要素 }のように引数を宣言する。... function ... ({...}:型)のように引数を宣言しない。
//- イベントハンドラや値は必要なら親から注入できるようにpropsの型を定義
//- 色はハードコーディングせずこれを使用⇒frontend\tailwind.config.js
//- stateless_ui/以下のTsxは「外観を期待しており動作を期待していないのでuseState/useEffect/useRefなどを禁止」「export function Example()を定義して、このファイルで定義したUI部品の一覧を確認できるようにする。」「app/sandbox/page.tsxにこのファイルの<このファイル.Example/>を配置する。」
//以上の共通ルールは保持、共通ルール以降に内容を実装して

"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

/**
 * 3Dの寿司コンポーネントのProps
 */
export type Sushi3DProps = ThreeElements["group"] & {
	/** 寿司のネタの色（デフォルトはサーモンピンク） */
	toppingColor?: string;
};

/**
 * 皿の上にサーモンの寿司が乗っている3Dコンポーネント (Group)
 * Canvas内で使用されることを前提としています。
 */
export function Sushi3D(props: Sushi3DProps) {
	const { toppingColor, ...groupProps } = props;

	return (
		<group {...groupProps}>
			{/* 皿 (シンプルな円柱で代用) */}
			<mesh receiveShadow position={[0, 0, 0]}>
				<cylinderGeometry args={[1.5, 1.6, 0.1, 32]} />
				<meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
			</mesh>

			{/* シャリ (少し丸みを帯びた直方体) */}
			<mesh castShadow position={[0, 0.25, 0]}>
				<boxGeometry args={[0.8, 0.4, 0.5]} />
				<meshStandardMaterial color="#f8f8f8" roughness={0.8} />
			</mesh>

			{/* ネタ：サーモン (シャリの上に乗る少し平たい直方体) */}
			<mesh castShadow position={[0, 0.5, 0]}>
				<boxGeometry args={[1.0, 0.15, 0.6]} />
				<meshStandardMaterial
					color={toppingColor || "#ff8c69"}
					roughness={0.3}
					metalness={0.1}
				/>
			</mesh>
		</group>
	);
}

/**
 * サンドボックス表示用のExampleコンポーネント
 */
export function Example() {
	return (
		<div className="flex flex-col items-center space-y-4">
			<h2 className="text-xl font-bold">Sushi3D Example</h2>
			<div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
				<Canvas shadows>
					<PerspectiveCamera makeDefault position={[3, 3, 3]} fov={50} />
					<OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
					<Environment preset="city" />

					<Sushi3D position={[0, -0.5, 0]} />

					<ContactShadows
						opacity={0.4}
						scale={10}
						blur={2.4}
						far={0.8}
						resolution={256}
						color="#000000"
					/>
				</Canvas>
			</div>
			<p className="text-sm text-gray-500">ドラッグで回転、スクロールでズームが可能です。</p>
		</div>
	);
}
