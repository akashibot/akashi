use akashi_shared::{AkashiContext, AkashiResult, database::models::tag::Tag, error::AkashiErrors};
use poise::{builtins::paginate, serenity_prelude::User};

/// Get all the tags in the guild (and user's tags)
///
/// Specify an user to check their tags
///
/// <prefix>tag list
/// <prefix>tag list @user
#[poise::command(slash_command, prefix_command)]
pub async fn list(
	ctx: AkashiContext<'_>,
	#[description = "User to search by"] user: Option<User>,
) -> AkashiResult {
	let database = ctx.data().database.lock().await.clone();
	let pool = database.pool.clone();

	let guild_id = match ctx.guild_id() {
		Some(id) => id.to_string(),
		None => return Err(AkashiErrors::OnlyGuild.into()),
	};

	let tags = match user.clone() {
		Some(user) => {
			if user.bot() {
				return Err(AkashiErrors::TargetBot.into());
			}

			Tag::list_user(&pool, guild_id, user.id.to_string()).await?
		}
		None => Tag::list_guild(&pool, guild_id).await?,
	};

	if tags.is_empty() {
		return Err(AkashiErrors::NoTags.into());
	}

	let only_name = tags
		.iter()
		.map(|tag| tag.name.clone())
		.collect::<Vec<String>>();

	let tags_chunked = only_name.chunks(10).collect::<Vec<_>>();
	let tags_pages: Vec<String> = tags_chunked
		.iter()
		.map(|tag| {
			let mapped_tags = tag
				.iter()
				.enumerate()
				.map(|(index, tag)| format!("**{}.** `{}`", index + 1, tag))
				.collect::<Vec<_>>();

			mapped_tags.join("\n")
		})
		.collect();

	let tags_pages_ref: Vec<&str> = tags_pages.iter().map(|s| s.as_str()).collect();

	paginate(ctx, &tags_pages_ref).await?;

	Ok(())
}
