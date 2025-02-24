pub(crate) mod commands;

use std::path::PathBuf;

pub(crate) trait ImageOperation {
    async fn run(&self, input: &PathBuf, output: &PathBuf);
}
