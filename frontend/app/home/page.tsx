import TwitterHome, {TwitterUser} from "@/stateless_ui/TwitterHome"
export default function page(){
	const x:TwitterUser={
		name: "lzpel",
		sub: "lzpel",
		icon: ""
	}
	return <TwitterHome user={x}>

	</TwitterHome>
}