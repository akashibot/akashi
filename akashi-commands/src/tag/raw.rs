use super::get::autocomplete_tag_name;
use akashi_shared::{AkashiContext, AkashiResult, database::models::tag::Tag, error::AkashiErrors};

/// Get a tag information
///
/// <prefix>tag raw <tag_name>
#[poise::command(slash_command, prefix_command, guild_only, category = "tag")]
pub async fn raw(
	ctx: AkashiContext<'_>,
	#[description = "Tag name"]
	#[autocomplete = "autocomplete_tag_name"]
	name: String,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = ctx.guild_id().unwrap().to_string();

	let tag = Tag::get(&pool, guild_id.clone(), name.clone()).await?;

	match tag {
		Some(tag) => {
			let created_at = tag.created_at.and_utc().timestamp();

			ctx.reply(format!(
				"# {}\n```\n{}\n```\nViews: `{}`\nCreated <t:{created_at}:R> by <@{}>",
				tag.name, tag.content, tag.views, tag.user_id
			))
			.await?;
		}
		None => return Err(AkashiErrors::TagNotFound.into()),
	}

	Ok(())
}
