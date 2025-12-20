import Button from "@/stateless_ui/Button";
import * as FormControls from "@/stateless_ui/FormControls";
import * as SignIn from "@/stateless_ui/SignInUp";
import { Home } from 'lucide-react';
export default function page() {
	return <>
		<div className="p-4 space-y-4">
			<Button icon={<Home />}>
				title
			</Button>
			<hr />
			<FormControls.Example />
			<hr />
			<SignIn.Example />
		</div>
	</>
}