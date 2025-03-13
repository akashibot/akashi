use akashi_shared::{AkashiContext, AkashiResult};

#[poise::command(prefix_command, owners_only, hide_in_help)]
pub async fn servers(ctx: AkashiContext<'_>) -> AkashiResult {
	poise::builtins::servers(ctx).await?;

	Ok(())
}
