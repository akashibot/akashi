use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod debug;
mod tag;
mod util;

#[macro_use]
extern crate tracing;

/// Basic macro to group all commands
macro_rules! register_all_commands {
    ( $( $module:expr ),* $(,)? ) => {
        {
            let mut commands = Vec::new();
            $(
                commands.extend($module);
            )*
            commands
        }
    };
}

pub fn register_all() -> Vec<Command<AkashiData, AkashiError>> {
	register_all_commands![util::register(), tag::register(), debug::register()]
}
