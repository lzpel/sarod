"use client"
import Redirect from "@/stateless_ui/Redirect";
import { useUser } from "@/app/Provider";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { Sushi3D } from "@/stateless_ui/Sushi3D";
import SignInUp from "@/stateless_ui/SignInUp";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Page() {
	const { user, loading } = useUser();
	if (loading) {
		return <div>Loading...</div>;
	}
	if (user) {
		return <Redirect target="/new" />
	}
	return <SushiLogin />;
}

/**
 * 回転ずしを背景にしたログインページ
 */
function SushiLogin() {
	const isJapanese = typeof navigator !== "undefined" && navigator.language.startsWith("ja");
	const title = isJapanese ? "回転ずし3D" : "Sushi3D";

	return (
		<main className="min-h-screen bg-background-default flex flex-col items-center justify-center relative overflow-hidden p-4">
			{/* 3D背景 (流れる寿司) */}
			<div className="absolute inset-0 z-0 opacity-30">
				<Canvas shadows>
					<PerspectiveCamera
						makeDefault
						position={[0, 4, 12]}
						fov={50}
						onUpdate={(self) => self.lookAt(0, 0, 0)}
					/>
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
					<Environment preset="city" />
					<RevolvingSushi />
					<ContactShadows
						opacity={0.4}
						scale={20}
						blur={2.4}
						far={0.8}
						resolution={256}
						color="#000000"
						position={[0, -0.1, 0]}
					/>
				</Canvas>
			</div>

			{/* メインコンテンツ */}
			<div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
				{/* ヒーローエリア: タイトルと大きな寿司 */}
				<div className="flex flex-col items-center gap-4 text-center">
					<h1 className="text-5xl font-black text-text-primary tracking-tighter drop-shadow-md">
						{title}
					</h1>
				</div>

				{/* ログインフォーム */}
				<div className="w-full">
					<SignInUp
						mode="signin"
						hasForm={false}
						onGoogleClick="/api/auth/google"
						toggleLinkHref="/signup"
					/>
				</div>
			</div>
		</main>
	);
}
/**
 * アニメーションを制御するコンポーネント
 */
function RevolvingSushi() {
	const groupRef = useRef<THREE.Group>(null);

	// 寿司のネタのバリエーション
	const toppings = [
		"#ff8c69", // サーモン
		"#ff4500", // 赤身
		"#fafad2", // 玉子
		"#ffffff", // イカ
		"#ff69b4", // 甘エビ
	];

	// 1フレームごとに実行される処理
	useFrame((state, delta) => {
		if (groupRef.current) {
			// 全体を右に移動
			groupRef.current.children.forEach((child) => {
				child.position.x += delta * 2;
				// 画面端（右）に来たら左に戻す
				if (child.position.x > 8) {
					child.position.x = -8;
				}
			});
		}
	});

	return (
		<group ref={groupRef}>
			{toppings.map((color, index) => (
				<Sushi3D
					key={index}
					toppingColor={color}
					position={[index * 3.5 - 7, 0, 0]}
				/>
			))}
		</group>
	);
}