use super::get::autocomplete_tag_name;
use akashi_shared::database::models::tag::Tag;
use akashi_shared::error::AkashiErrors;
use akashi_shared::{AkashiContext, AkashiResult};

/// Edit a tag in the guild
#[poise::command(slash_command, prefix_command)]
pub async fn edit(
	ctx: AkashiContext<'_>,
	#[description = "Tag name"]
	#[autocomplete = "autocomplete_tag_name"]
	name: String,
	#[description = "Tag new content"]
	#[rest]
	content: String,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = match ctx.guild_id() {
		Some(id) => id.to_string(),
		None => return Err(AkashiErrors::OnlyGuild.into()),
	};

	let tag_owner = match Tag::get(&pool, guild_id.clone(), name.clone()).await? {
		Some(tag) => tag.user_id,
		None => return Err(AkashiErrors::TagNotFound.into()),
	};

	if tag_owner != ctx.author().id.to_string() {
		return Err(AkashiErrors::TagOwner.into());
	}

	let tag = Tag::edit(&pool, guild_id, name, content).await?;

	ctx.reply(format!("Edited the tag `{}`", tag.name)).await?;
	Ok(())
}
