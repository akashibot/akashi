use thiserror::Error;

#[derive(Debug, Error)]
pub enum AkashiDatabaseError {
    #[error("Tag already exists in this guild")]
    ExistingTag,

    // Custom error wrapping sqlx::Error
    #[error("{0}")]
    Sqlx(#[from] sqlx::Error),
}

impl From<AkashiDatabaseError> for sqlx::Error {
    fn from(err: AkashiDatabaseError) -> sqlx::Error {
        match err {
            AkashiDatabaseError::Sqlx(e) => e,
            _ => sqlx::Error::Configuration(Box::new(err)),
        }
    }
}
