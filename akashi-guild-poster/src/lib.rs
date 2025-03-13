use std::sync::Arc;

use akashi_shared::AkashiResult;
use isahc::{HttpClient, Request};
use serde_json::json;

pub struct AkashiGuildPoster {
	client: Arc<HttpClient>,
	bot_id: Arc<str>,
	topgg_token: Arc<str>,
	dlistgg_token: Arc<str>,
}

impl AkashiGuildPoster {
	pub fn new(
		bot_id: impl Into<Arc<str>>,
		topgg_token: impl Into<Arc<str>>,
		dlistgg_token: impl Into<Arc<str>>,
	) -> Self {
		Self {
			client: Arc::new(HttpClient::builder().max_connections(5).build().unwrap()),
			bot_id: bot_id.into(),
			topgg_token: topgg_token.into(),
			dlistgg_token: dlistgg_token.into(),
		}
	}

	async fn post(&self, url: String, token: &Arc<str>, body: serde_json::Value) -> AkashiResult {
		let request = Request::post(url)
			.header("Authorization", &**token)
			.body(body.to_string())?;

		self.client.send_async(request).await?;

		Ok(())
	}

	pub async fn post_topgg(&self, count: u64) -> AkashiResult {
		self.post(
			format!("https://top.gg/api/bots/{}/stats", self.bot_id),
			&self.topgg_token,
			json!({"server_count": count}),
		)
		.await
	}

	pub async fn post_dlist(&self, count: u64) -> AkashiResult {
		self.post(
			format!("https://api.discordlist.gg/v0/bots/{}/guilds", self.bot_id),
			&self.dlistgg_token,
			json!({"count": count}),
		)
		.await
	}
}
