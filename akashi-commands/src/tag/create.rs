use akashi_shared::{AkashiContext, AkashiResult, database::models::tag::Tag, error::AkashiErrors};

/// Create a new tag in the guild
#[poise::command(
	slash_command,
	prefix_command,
	guild_only,
	aliases("new", "add"),
	category = "tag"
)]
pub async fn create(
	ctx: AkashiContext<'_>,
	#[description = "Tag name"] name: String,
	#[description = "Tag content"]
	#[rest]
	content: String,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = ctx.guild_id().unwrap().to_string();

	let tag = match Tag::create(&pool, guild_id, ctx.author().id.to_string(), name, content).await {
		Ok(tag) => tag,
		Err(_) => return Err(AkashiErrors::TagAlreadyExists.into()), // this should be more optimized
	};

	ctx.reply(format!("created tag: {}", tag.name)).await?;
	Ok(())
}
