import { TabsPanel } from "@/stateless_ui/TabsWithDataKey";
import Base from "@/app/Base";

export default function page() {
	return <>
		<Base>
			<TabsPanel value="home">
				<div key="home">home</div>
			</TabsPanel>
		</Base>
	</>
}