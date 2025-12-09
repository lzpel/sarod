fn main() {
	let input_api = serde_json::from_str(
		std::fs::read_to_string("../out/schema/openapi.json")
			.unwrap()
			.as_str(),
	)
	.unwrap();
	let env = mandolin::environment(input_api).unwrap();
	let template = env.get_template("RUST_AXUM").unwrap();
	let output = template.render(0).unwrap();
	// write the rendered output
	std::fs::write("src/out.rs", output).unwrap();
}
