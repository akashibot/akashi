use akashi_shared::database::models::tag::Tag;
use akashi_shared::{AkashiContext, AkashiResult};

/// Create a new tag in the guild
#[poise::command(slash_command, prefix_command, aliases("new", "add"))]
pub async fn create(
    ctx: AkashiContext<'_>,
    #[description = "Tag name"] name: String,
    #[description = "Tag content"]
    #[rest]
    content: String,
) -> AkashiResult {
    let database = ctx.data().database.lock().await.clone();
    let pool = database.pool.clone();

    let guild_id = match ctx.guild_id() {
        Some(id) => id.to_string(),
        None => return Err("only available in a guild".into()),
    };

    let tag = Tag::create(&pool, guild_id, ctx.author().id.to_string(), name, content).await?;

    ctx.reply(format!("created tag: {}", tag.name)).await?;
    Ok(())
}
