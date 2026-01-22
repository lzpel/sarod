use reqwest::header::ACCEPT;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://kp3qwanbdo2djj6dvuacndxzjq0qwdym.lambda-url.ap-northeast-1.on.aws/api/task")
        .header(ACCEPT, "application/json")
        .send()
        .await?;

    let body = response.text().await?;
    println!("{}", body);

    Ok(())
}
