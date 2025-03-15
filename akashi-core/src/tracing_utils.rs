use std::env;
use tracing_subscriber::{EnvFilter, Layer, filter::LevelFilter, prelude::*};

/// Initializes the `tracing` logging framework.
///
/// Regular CLI output is influenced by the optional
/// [`LOG_LEVEL`](tracing_subscriber::filter::EnvFilter) environment variable
/// and defaults to `INFO` if not set.
///
/// This function also sets up the Sentry error reporting integration for the
/// `tracing` framework, which is hardcoded to include all `INFO` level events.
pub fn init() {
	let level = env::var("LOG_LEVEL").unwrap_or_else(|_| "INFO".to_string());

	// Convert the string to a `LevelFilter`, defaulting to INFO if invalid
	let level_filter = level.parse::<LevelFilter>().unwrap_or(LevelFilter::INFO);

	init_with_default_level(level_filter);
}

fn init_with_default_level(level: LevelFilter) {
	let env_filter = EnvFilter::builder()
		.with_default_directive(level.into())
		.from_env_lossy();

	let log_layer = tracing_subscriber::fmt::layer()
		.compact()
		.without_time()
		.with_filter(env_filter)
		.boxed();

	tracing_subscriber::registry().with(log_layer).init();
}

/// Initializes the `tracing` logging framework for usage in tests.
pub fn init_for_test() {
	let env_filter = EnvFilter::builder()
		.with_default_directive(LevelFilter::DEBUG.into())
		.from_env_lossy()
		.add_directive("tokio_postgres=info".parse().unwrap());

	let _ = tracing_subscriber::fmt()
		.compact()
		.with_env_filter(env_filter)
		.with_test_writer()
		.try_init();
}
