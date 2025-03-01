use super::get::autocomplete_tag_name;
use akashi_shared::database::models::tag::Tag;
use akashi_shared::error::AkashiErrors;
use akashi_shared::{AkashiContext, AkashiResult};

/// Get a tag information
///
/// <prefix>tag raw <tag_name>
#[poise::command(slash_command, prefix_command)]
pub async fn raw(
	ctx: AkashiContext<'_>,
	#[description = "Tag name"]
	#[autocomplete = "autocomplete_tag_name"]
	name: String,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = match ctx.guild_id() {
		Some(id) => id.to_string(),
		None => return Err(AkashiErrors::OnlyGuild.into()),
	};

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
