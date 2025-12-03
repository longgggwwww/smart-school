use std::fmt;

/// Config-related errors
#[derive(Debug)]
pub enum ConfigError {
    /// Failed to get app config directory
    ConfigDirNotFound(String),
    /// Failed to read config file
    ReadError(String),
    /// Failed to write config file
    WriteError(String),
    /// Failed to parse config
    ParseError(String),
    /// Invalid value provided
    InvalidValue(String),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConfigError::ConfigDirNotFound(msg) => {
                write!(f, "Failed to get app config directory: {}", msg)
            }
            ConfigError::ReadError(msg) => write!(f, "Failed to read config file: {}", msg),
            ConfigError::WriteError(msg) => write!(f, "Failed to write config file: {}", msg),
            ConfigError::ParseError(msg) => write!(f, "Failed to parse config: {}", msg),
            ConfigError::InvalidValue(msg) => write!(f, "Invalid value: {}", msg),
        }
    }
}

impl std::error::Error for ConfigError {}

// Convert to String for Tauri command return
impl From<ConfigError> for String {
    fn from(error: ConfigError) -> Self {
        error.to_string()
    }
}
