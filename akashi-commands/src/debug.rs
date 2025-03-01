use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod disable_command;
mod enable_command;
mod register;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
	vec![
		register::register(),
		disable_command::dev_disable_command(),
		enable_command::dev_enable_command(),
	]
}
