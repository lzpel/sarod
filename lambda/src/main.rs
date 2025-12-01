mod out;
mod api;
#[allow(dead_code)]
#[tokio::main]
async fn main() {
	let server=api::Api{};
	let port:u16 = std::env::var("PORT").unwrap_or("8080".to_string()).parse().expect("PORT should be integer");
	out::print_axum_router(port);
	let app = out::axum_router(server)
		.fallback(frontend);
	let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}")).await.unwrap();
	println!("serve on http://localhost:{port}/");
	axum::serve(listener, app.clone())
		.with_graceful_shutdown(async move{ 
			tokio::signal::ctrl_c().await.unwrap();
		 })
		.await
		.unwrap();
}

#[cfg(not(feature = "frontend"))]
async fn frontend(_uri: axum::http::Uri) -> axum::response::Response<axum::body::Body> {
	return axum::response::Response::builder()
		.status(axum::http::status::StatusCode::NOT_FOUND)
		.body(axum::body::Body::from("not found"))
		.unwrap()
}
#[cfg(feature = "frontend")]
async fn frontend(uri: axum::http::Uri) -> axum::response::Response<axum::body::Body> {
	#[derive(rust_embed::Embed)]
	#[folder = "out"]   // ← このフォルダ配下をバイナリに埋め込む
	struct Assets;
    // /foo/bar → "foo/bar"
    let mut path = std::path::PathBuf::from(uri.path().trim_start_matches("/"));
    // ディレクトリっぽいアクセスは index.html
    if path.file_name().is_none() {
        path.push("index.html");
    }else if path.extension().is_none(){
		path.set_extension("html");
	}
    // 埋め込み検索
    let Some(file) = Assets::get(&path.to_string_lossy().to_string()) else {
		return axum::response::Response::builder()
			.status(axum::http::status::StatusCode::NOT_FOUND)
			.body(axum::body::Body::from("not found in frontend"))
			.unwrap()
    };

    axum::response::Response::builder()
        .status(axum::http::StatusCode::OK)
    	.body(axum::body::Body::from(file.data)).unwrap()
}