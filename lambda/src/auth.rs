use reqwest;
use serde::Deserialize;
use std::hash::{Hash, Hasher};

#[derive(Debug, Deserialize)]
pub struct GoogleOAuthSecret {
	web: OAuth,
}

impl GoogleOAuthSecret {
	pub fn load(path: &str) -> Result<OAuth, String> {
		let data = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
		let parsed: GoogleOAuthSecret = serde_json::from_str(&data).map_err(|e| e.to_string())?;
		Ok(parsed.web)
	}
}

#[derive(Debug, Deserialize)]
pub struct OAuth {
	pub client_id: String,
	pub client_secret: String,
	pub token_uri: String,
	pub auth_uri: String,
}

#[derive(Deserialize, Debug)]
pub struct TokenResponse {
	access_token: String,
	expires_in: u64,
	refresh_token: Option<String>,
	scope: String,
	token_type: String,
	id_token: Option<String>, // OIDC の場合これがメイン
}

impl OAuth {
	const SEPRATOR: &str = ">>>";
	pub fn redirect_uri(&self, redirect_uri: &str) -> String {
		let start_time = std::time::SystemTime::now();
		let mut hasher = std::hash::DefaultHasher::new();
		start_time.hash(&mut hasher);
		let state = hasher.finish();
		format!(
			"{auth_uri}?client_id={client_id}&redirect_uri={redir}&response_type=code&scope=openid%20email%20profile&state={state}",
			auth_uri = self.auth_uri,
			client_id = self.client_id,
			redir = url_encode(&redirect_uri),
			state = url_encode(&format!("{redirect_uri}{}{state}", Self::SEPRATOR)),
		)
	}
	pub async fn callback(&self, state: &str, code: &str) -> Result<TokenResponse, String> {
		let state_decoded = url_decode(state).map_err(|e| e.to_string())?;
		let redirect_uri = state_decoded
			.split(Self::SEPRATOR)
			.next()
			.ok_or(format!("Invalid oauth state:{state}"))?;
		let form = [
			("code", code),
			("client_id", &self.client_id),
			("client_secret", &self.client_secret),
			("redirect_uri", &redirect_uri),
			("grant_type", "authorization_code"),
		];
		let client = reqwest::Client::new();
		let request = client
			.post(&self.token_uri)
			.form(&form)
			.build()
			.map_err(|e| format!("Invalid request: {e}"))?;
		let response = client
			.execute(request)
			.await
			.map_err(|e| format!("HTTP request failed: {e}"))?;
		if response.status().is_success() {
			let tokens = response
				.json::<TokenResponse>()
				.await
				.map_err(|e| format!("Failed to parse JSON: {e}"))?;
			return Ok(tokens);
		} else {
			let status = response.status();
			let text = response
				.text()
				.await
				.unwrap_or_else(|_| "<body read error>".into());
			return Err(format!("token endpoint returned error {status}: {text}"));
		}
	}
}

pub fn url_encode(input: &str) -> String {
	let mut out = String::new();
	for b in input.bytes() {
		let c = b as char;
		// RFC 3986 unreserved: ALPHA / DIGIT / "-" / "." / "_" / "~"
		if c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.' || c == '~' {
			out.push(c);
		} else {
			out.push('%');
			out.push(hex_digit(b >> 4));
			out.push(hex_digit(b & 0x0F));
		}
	}
	out
}

fn hex_digit(n: u8) -> char {
	match n {
		0..=9 => (b'0' + n) as char,
		10..=15 => (b'A' + (n - 10)) as char,
		_ => unreachable!(),
	}
}

pub fn url_decode(input: &str) -> Result<String, &'static str> {
	let mut out = String::new();
	let bytes = input.as_bytes();
	let mut i = 0;

	while i < bytes.len() {
		match bytes[i] {
			b'%' => {
				if i + 2 >= bytes.len() {
					return Err("incomplete percent-encoding");
				}

				let hi = from_hex_digit(bytes[i + 1]).ok_or("invalid hex")?;
				let lo = from_hex_digit(bytes[i + 2]).ok_or("invalid hex")?;

				out.push(((hi << 4) | lo) as char);
				i += 3;
			}
			_ => {
				out.push(bytes[i] as char);
				i += 1;
			}
		}
	}

	Ok(out)
}

fn from_hex_digit(b: u8) -> Option<u8> {
	match b {
		b'0'..=b'9' => Some(b - b'0'),
		b'A'..=b'F' => Some(b - b'A' + 10),
		b'a'..=b'f' => Some(b - b'a' + 10),
		_ => None,
	}
}
