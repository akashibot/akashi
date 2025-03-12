use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod register;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
	vec![register::register()]
}
