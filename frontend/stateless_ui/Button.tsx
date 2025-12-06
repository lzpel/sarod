// ボタンです
// 
export default function Button(props: { icon: React.ReactNode, children: React.ReactNode }) {
	return <button>{props.children}</button>
}