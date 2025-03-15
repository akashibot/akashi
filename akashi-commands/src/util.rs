use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod emoji;
mod help;
mod stats;
mod translate;
mod vote;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
	vec![
		stats::stats(),
		translate::translate(),
		translate::context_menu_translate(),
		emoji::emoji(),
		help::help(),
		vote::vote(),
	]
}
