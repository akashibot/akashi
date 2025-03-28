use akashi_shared::{AkashiContext, AkashiResult};

/// Show the available botlists to bot for Akashi
#[poise::command(slash_command, prefix_command, category = "util")]
pub async fn vote(ctx: AkashiContext<'_>) -> AkashiResult {
	ctx.reply(
		"> You can vote for Akashi in the following botlists: (direct links)
        [top.gg](<https://top.gg/bot/1288610561956773979/vote>)
        [dlist.gg](<https://discordlist.gg/bot/1288610561956773979/vote?action=vote>)
        [dsc.bot](<https://nightly.dsc.bot/akashi.4672/vote>)",
	)
	.await?;

	Ok(())
}
