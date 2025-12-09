//! Common Error Types
//! Centralized error handling for the application

use serde::{Deserialize, Serialize};
use std::fmt;

/// Application error kinds
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ErrorKind {
    /// Configuration error
    Config,
    /// File I/O error
    Io,
    /// Serialization/deserialization error
    Serialization,
    /// Window management error
    Window,
    /// Authentication error
    Auth,
    /// Permission denied
    Permission,
    /// Resource not found
    NotFound,
    /// Invalid input
    InvalidInput,
    /// Unknown error
    Unknown,
}

/// Application-wide error type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppError {
    pub kind: ErrorKind,
    pub message: String,
    pub details: Option<String>,
}

impl AppError {
    pub fn new(kind: ErrorKind, message: impl Into<String>) -> Self {
        Self {
            kind,
            message: message.into(),
            details: None,
        }
    }

    pub fn with_details(mut self, details: impl Into<String>) -> Self {
        self.details = Some(details.into());
        self
    }

    pub fn config(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::Config, message)
    }

    pub fn io(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::Io, message)
    }

    pub fn window(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::Window, message)
    }

    pub fn auth(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::Auth, message)
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::NotFound, message)
    }

    pub fn invalid_input(message: impl Into<String>) -> Self {
        Self::new(ErrorKind::InvalidInput, message)
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.details {
            Some(details) => write!(f, "{:?}: {} ({})", self.kind, self.message, details),
            None => write!(f, "{:?}: {}", self.kind, self.message),
        }
    }
}

impl std::error::Error for AppError {}

// Convert from std::io::Error
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        Self::io(err.to_string())
    }
}

// Convert to String for Tauri commands
impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        err.to_string()
    }
}

/// Result type alias for app operations
pub type AppResult<T> = Result<T, AppError>;
