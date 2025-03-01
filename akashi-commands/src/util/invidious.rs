use akashi_shared::{
	AkashiContext, AkashiResult,
	util::{cache_key, common_transaction_options, paginate, seconds_to_video_duration},
};
use akashi_strings::utils::encode::encode;
use isahc::AsyncReadResponseExt;
use poise::{
	ChoiceParameter,
	serenity_prelude::{Color, CreateEmbed},
};

#[derive(Debug, poise::ChoiceParameter, Clone)]
pub enum HostChoice {
	#[name = "https://iv.duti.dev"]
	A,
	#[name = "https://invidious.f5.si"]
	B,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvidiousVideo {
	#[serde(rename = "type")]
	pub type_field: String,
	pub title: String,
	pub video_id: String,
	pub author: String,
	pub author_id: String,
	pub author_url: String,
	pub author_verified: bool,
	pub video_thumbnails: Vec<InvidiousVideoThumbnail>,
	pub description: String,
	pub description_html: String,
	pub view_count: i64,
	pub view_count_text: String,
	pub published: i64,
	pub published_text: String,
	pub length_seconds: i64,
	pub live_now: bool,
	pub premium: bool,
	pub is_upcoming: bool,
	pub is_new: bool,
	pub is4k: bool,
	pub is8k: bool,
	pub is_vr180: bool,
	pub is_vr360: bool,
	pub is3d: bool,
	pub has_captions: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvidiousVideoThumbnail {
	pub quality: String,
	pub url: String,
	pub width: i64,
	pub height: i64,
}

/// Search through YouTube videos using Invidious API
#[poise::command(slash_command, prefix_command)]
pub async fn invidious(
	ctx: AkashiContext<'_>,
	#[description = "Query to search for"] query: String,
	#[description = "Host to search from"] host: Option<HostChoice>,
) -> AkashiResult {
	let host = host.unwrap_or_else(|| HostChoice::A);
	let cache = ctx.data().cache.lock().await.clone();

	let query = query.split(" ").collect::<Vec<_>>().join("%20");
	debug!("parsed: {query}");

	let cached_videos = cache
		.get_item_json::<Vec<InvidiousVideo>>(&cache_key(&[host.name(), &query]), None)
		.await?;

	if let Some(cached) = cached_videos {
		let embeds = cached
			.iter()
			.map(|video| {
				CreateEmbed::new()
					.title(video.title.clone())
					.url(format!(
						"{}/watch?v={}",
						"https://www.youtube.com", video.video_id
					))
					.description(video.description.clone())
					.image(video.video_thumbnails[0].url.clone())
					.field("Author", video.author.clone(), false)
					.field("Views", video.view_count.to_string(), true)
					.field(
						"Length",
						seconds_to_video_duration(video.length_seconds),
						true,
					)
					.color(Color::TEAL)
			})
			.collect::<Vec<CreateEmbed>>();

		paginate(ctx, &embeds).await?;
		return Ok(());
	}

	let videos = search_invidious(&host, &query).await?;

	cache
		.set_item_json(
			&cache_key(&[host.name(), &query]),
			&videos,
			Some(&common_transaction_options(Some(10))),
		)
		.await?;

	let embeds = videos
		.iter()
		.map(|video| {
			CreateEmbed::new()
				.title(video.title.clone())
				.url(format!(
					"{}/watch?v={}",
					"https://www.youtube.com", video.video_id
				))
				.description(video.description.clone())
				.image(video.video_thumbnails[0].url.clone())
				.field("Author", video.author.clone(), false)
				.field("Views", video.view_count.to_string(), true)
				.field(
					"Length",
					seconds_to_video_duration(video.length_seconds),
					true,
				)
		})
		.collect::<Vec<CreateEmbed>>();

	paginate(ctx, &embeds).await?;

	Ok(())
}

async fn search_invidious(host: &HostChoice, query: &str) -> AkashiResult<Vec<InvidiousVideo>> {
	let response = isahc::get_async(format!(
		"{}/api/v1/search?q={}&type={}",
		host.name(),
		query,
		encode("\"video\"")
	))
	.await?
	.json::<Vec<InvidiousVideo>>()
	.await?;

	Ok(response)
}
