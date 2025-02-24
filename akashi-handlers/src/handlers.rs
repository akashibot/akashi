use akashi_shared::{AkashiContext, AkashiData, AkashiError, AkashiResult};

pub async fn on_error(error: poise::FrameworkError<'_, AkashiData, AkashiError>) {
    match error {
        poise::FrameworkError::Command { error, ctx, .. } => {
            warn!("Error in command `{}`: {:?}", ctx.command().name, error);
            ctx.reply(error.to_string()).await.unwrap();
        }
        poise::FrameworkError::CommandCheckFailed { ctx, error, .. } => {
            ctx.reply(
                error
                    .unwrap_or("This command is unavailable".into())
                    .to_string(),
            )
            .await
            .unwrap();
        }
        error => {
            if let Err(e) = poise::builtins::on_error(error).await {
                println!("Error while handling error: {}", e)
            }
        }
    }
}

pub async fn pre_command(ctx: AkashiContext<'_>) {
    debug!(
        "Executing command {} on guild {}",
        ctx.command().qualified_name,
        ctx.guild_id().unwrap().to_string()
    )
}

pub async fn post_command(ctx: AkashiContext<'_>) {
    debug!(
        "Executed command {} on guild {}",
        ctx.command().qualified_name,
        ctx.guild_id().unwrap().to_string()
    )
}

pub async fn command_check(ctx: AkashiContext<'_>) -> AkashiResult<bool> {
    let mut disabled_commands = ctx.data().disabled_commands.clone();

    if ctx.author().id == 852970774067544165 {
        return Err("u can't use Akashi".into());
    };

    let is_command_disabled = disabled_commands
        .iter()
        .find(|c| ctx.command().qualified_name == c.to_string())
        .is_some();

    if is_command_disabled {
        return Err("this command is disabled".into());
    }

    Ok(true)
}
