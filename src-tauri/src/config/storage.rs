use std::fs;
use std::path::PathBuf;
use tauri::Manager;

use super::{AppConfig, ConfigError};

/// Default configuration YAML embedded at compile time
const DEFAULT_CONFIG_YAML: &str = include_str!("../../default-config.yaml");

/// Config file name
const CONFIG_FILE_NAME: &str = "config.yaml";

/// Get the path to the config file
pub fn get_config_path(app: &tauri::AppHandle) -> Result<PathBuf, ConfigError> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| ConfigError::ConfigDirNotFound(e.to_string()))?;

    Ok(config_dir.join(CONFIG_FILE_NAME))
}

/// Load default config from embedded YAML
pub fn load_default_config() -> AppConfig {
    serde_yaml::from_str(DEFAULT_CONFIG_YAML).unwrap_or_default()
}

/// Load config from YAML file
pub fn load_config(app: &tauri::AppHandle) -> AppConfig {
    let config_path = match get_config_path(app) {
        Ok(path) => path,
        Err(_) => return load_default_config(),
    };

    // Try to load existing config
    if config_path.exists() {
        if let Ok(content) = fs::read_to_string(&config_path) {
            if let Ok(config) = serde_yaml::from_str::<AppConfig>(&content) {
                return config;
            }
        }
    }

    // Config doesn't exist - create from default config template
    let config = load_default_config();

    // Save the default config to user's config directory
    let _ = save_config(app, &config);

    config
}

/// Save config to YAML file
pub fn save_config(app: &tauri::AppHandle, config: &AppConfig) -> Result<(), ConfigError> {
    let config_path = get_config_path(app)?;

    // Ensure config directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent).map_err(|e| ConfigError::WriteError(e.to_string()))?;
    }

    let yaml =
        serde_yaml::to_string(config).map_err(|e| ConfigError::ParseError(e.to_string()))?;

    fs::write(&config_path, yaml).map_err(|e| ConfigError::WriteError(e.to_string()))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_default_config() {
        let config = load_default_config();
        assert_eq!(config.language, "en");
    }
}
