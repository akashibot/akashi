use crate::{Context, Error};

/// Display Akashi servers (public ones)
#[poise::command(track_edits, slash_command, category = "Util")]
pub async fn servers(ctx: Context<'_>) -> Result<(), Error> {
    poise::builtins::servers(ctx).await?;

    Ok(())
}
