use akashi_shared::{AkashiContext, AkashiResult};

/// Show Akashi stats
#[poise::command(slash_command, prefix_command)]
pub async fn stats(ctx: AkashiContext<'_>) -> AkashiResult {
    let uptime = ctx.data().uptime.clone().elapsed();

    let div_mod = |a, b| (a / b, a % b);

    let seconds = uptime.as_secs();
    let (minutes, seconds) = div_mod(seconds, 60);
    let (hours, minutes) = div_mod(minutes, 60);
    let (days, hours) = div_mod(hours, 24);

    ctx.reply(format!(
        "Bot has been online: {days}d {hours}h {minutes}m {seconds}s"
    ))
    .await?;

    Ok(())
}
