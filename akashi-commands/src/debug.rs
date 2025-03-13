use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod register;
mod servers;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
	vec![register::register(), servers::servers()]
}
