use akashi_shared::{AkashiContext, AkashiResult};

#[poise::command(prefix_command, owners_only, hide_in_help)]
pub async fn register(ctx: AkashiContext<'_>) -> AkashiResult {
	poise::builtins::register_application_commands(ctx, true).await?;

	Ok(())
}
