use akashi_shared::{AkashiContext, AkashiResult, error::AkashiErrors};
use akashi_strings::algorithms::base64::base64_encode;
use isahc::AsyncReadResponseExt;
use poise::CreateReply;
use regex::Regex;

/// Download emoji(s) (Native emojis are not supported)
#[poise::command(
	prefix_command,
	slash_command,
	aliases("e", "em"),
	required_bot_permissions = "MANAGE_GUILD_EXPRESSIONS",
	required_permissions = "MANAGE_GUILD_EXPRESSIONS",
	category = "util"
)]
pub async fn emoji(
	ctx: AkashiContext<'_>,
	#[description = "Whether to add emojis or not"]
	#[flag]
	add: bool,
	#[description = "Emojis to download"]
	#[rest]
	emojis: String,
) -> AkashiResult {
	let custom_emoji_regex = Regex::new(r"<a?:(\w+):(\d+)>").unwrap();
	let mut emoji_links = Vec::new();

	let guild_id = match ctx.guild_id() {
		Some(id) => id,
		None => return Err(AkashiErrors::OnlyGuild.into()),
	};

	let author = ctx.author_member().await.unwrap();

	for cap in custom_emoji_regex.captures_iter(&emojis) {
		if let (Some(name), Some(id)) = (cap.get(1), cap.get(2)) {
			let emoji_name = name.as_str();
			let emoji_id = id.as_str();

			let link = format!("https://cdn.discordapp.com/emojis/{}", emoji_id);

			if add {
				let encoded_url = encode_emoji_url(&link).await?;
				guild_id
					.create_emoji(
						ctx.http(),
						emoji_name,
						&encoded_url,
						Some(&format!("Added by {:?}", author.user.id.to_string())),
					)
					.await?;
			}

			emoji_links.push(format!("[{}]({})", emoji_name, link));
		}
	}

	if emoji_links.is_empty() {
		// Похуй
		return Err(AkashiErrors::Custom("No valid emojis provided".to_string()).into());
	}

	let response = emoji_links.join("\n");

	ctx.send(CreateReply::default().content(response).reply(true))
		.await?;

	Ok(())
}

async fn encode_emoji_url(url: &str) -> AkashiResult<String> {
	let mut res = isahc::get_async(url).await?;
	let bytes = res.bytes().await?;
	let b64 = base64_encode(&bytes);

	let encoded_url = format!("data:image/png;base64,{b64}");

	Ok(encoded_url)
}
