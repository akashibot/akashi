use std::fmt;

#[derive(Debug)]
pub enum AkashiErrors {
	ForbiddenCommand,
	DisabledCommand,
	BlockedFromBot,
	TagNotFound,
	TagAlreadyExists,
	TagEmpty,
	TagOwner,
	NoTags,
	TargetBot,
	NoValidEmojis,
	OnlyGuild,
	Custom(String),
}

impl fmt::Display for AkashiErrors {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		match self {
			AkashiErrors::ForbiddenCommand => write!(f, "You cannot use this command"),
			AkashiErrors::DisabledCommand => write!(f, "This command is disabled"),
			AkashiErrors::BlockedFromBot => write!(f, "You cannot use Akashi"),
			AkashiErrors::TagNotFound => write!(f, "Tag not found"),
			AkashiErrors::TagAlreadyExists => write!(f, "Tag already exists"),
			AkashiErrors::TagEmpty => write!(f, "Tag has no content"),
			AkashiErrors::TagOwner => write!(f, "You are not the owner of this tag"),
			AkashiErrors::NoTags => write!(f, "No tags to show"),
			AkashiErrors::TargetBot => write!(f, "You cannot target a bot"),
			AkashiErrors::NoValidEmojis => write!(f, "No valid emojis found"),
			AkashiErrors::OnlyGuild => write!(f, "This command can only be used in a guild"),
			AkashiErrors::Custom(msg) => write!(f, "{msg}"),
		}
	}
}

impl std::error::Error for AkashiErrors {}
