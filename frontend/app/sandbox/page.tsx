"use client"
import React from "react";
import * as FormControls from "@/stateless_ui/FormControls";
import * as SignIn from "@/stateless_ui/SignInUp";
import * as Message from "@/stateless_ui/Message";
import * as IconWithLabel from "@/stateless_ui/IconWithLabel";
import * as Tabs from "@/stateless_ui/TabsWithDataKey";
import * as Thumbnail from "@/stateless_ui/Thumbnail";
import * as Premium from "@/stateless_ui/Subscription";
import * as SlideSwitch from "@/stateless_ui/SlideSwitch";
import * as Sushi3D from "@/stateless_ui/Sushi3D";
/**
 * サンドボックスページ
 */
export default function page() {

	return <>
		<div className="p-4 space-y-4">
			<hr />
			<Sushi3D.Example />
			<hr />
			<SlideSwitch.Example />
			<hr />
			<FormControls.Example />
			<hr />
			<SignIn.Example />
			<hr />
			<Message.Example />
			<hr />
			<IconWithLabel.Example />
			<hr />
			<Tabs.Example />
			<hr />
			<Thumbnail.Example />
			<hr />
			<Premium.Example />
		</div>
	</>
}