use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod emoji;
mod invidious;
mod stats;
mod translate;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
	vec![
		stats::stats(),
		invidious::invidious(),
		translate::translate(),
		translate::context_menu_translate(),
		emoji::emoji(),
	]
}
