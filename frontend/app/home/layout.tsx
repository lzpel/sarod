import Base from "@/app/Base";

export default function Layout(props: Readonly<{children: React.ReactNode;}>) {
	return (
		<Base>{props.children}</Base>
	);
}
