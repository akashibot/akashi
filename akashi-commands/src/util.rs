use akashi_shared::{AkashiData, AkashiError};
use poise::Command;

mod emoji;
mod invidious;
mod register;
mod stats;
mod translate;

pub fn register() -> Vec<Command<AkashiData, AkashiError>> {
    vec![
        stats::stats(),
        register::register(),
        invidious::invidious(),
        translate::translate(),
        translate::context_menu_translate(),
        emoji::emoji(),
    ]
}
