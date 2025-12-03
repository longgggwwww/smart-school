use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

// ============================================================================
// App Configuration Types
// ============================================================================

/// Screen mode for window display
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Default)]
#[serde(rename_all = "lowercase")]
pub enum ScreenMode {
    #[default]
    Normal,
    Maximized,
    Fullscreen,
}

impl ScreenMode {
    fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "normal" => Some(ScreenMode::Normal),
            "maximized" => Some(ScreenMode::Maximized),
            "fullscreen" => Some(ScreenMode::Fullscreen),
            _ => None,
        }
    }
}

/// Window state configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowConfig {
    pub width: u32,
    pub height: u32,
    pub x: Option<i32>,
    pub y: Option<i32>,
    /// Screen mode: "normal", "maximized", or "fullscreen"
    pub screen_mode: ScreenMode,
}

impl Default for WindowConfig {
    fn default() -> Self {
        Self {
            width: 800,
            height: 600,
            x: None,
            y: None,
            screen_mode: ScreenMode::Normal,
        }
    }
}

/// Startup configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartupConfig {
    pub auto_start: bool,
}

impl Default for StartupConfig {
    fn default() -> Self {
        Self { auto_start: false }
    }
}

/// Main application configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    /// Language code (e.g., "en", "vi")
    pub language: String,
    /// Theme: "dark", "light", or "system"
    pub theme: String,
    /// Window state (size, position, fullscreen)
    pub window: WindowConfig,
    /// Startup settings
    pub startup: StartupConfig,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            language: "en".to_string(),
            theme: "system".to_string(),
            window: WindowConfig::default(),
            startup: StartupConfig::default(),
        }
    }
}

// ============================================================================
// Config File Helpers
// ============================================================================

/// Default configuration YAML embedded at compile time
const DEFAULT_CONFIG_YAML: &str = include_str!("../default-config.yaml");

/// Get the path to the config file
fn get_config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get app config directory: {}", e))?;
    
    Ok(config_dir.join("config.yaml"))
}

/// Load default config from embedded YAML
fn load_default_config() -> AppConfig {
    serde_yaml::from_str(DEFAULT_CONFIG_YAML).unwrap_or_default()
}

/// Load config from YAML file
fn load_config_internal(app: &tauri::AppHandle) -> AppConfig {
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
    let _ = save_config_internal(app, &config);
    
    config
}

/// Save config to YAML file
fn save_config_internal(app: &tauri::AppHandle, config: &AppConfig) -> Result<(), String> {
    let config_path = get_config_path(app)?;
    
    // Ensure config directory exists
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }

    let yaml = serde_yaml::to_string(config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    
    fs::write(&config_path, yaml)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

// ============================================================================
// Tauri Commands
// ============================================================================

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Get the full app configuration
#[tauri::command]
fn get_config(app: tauri::AppHandle) -> AppConfig {
    load_config_internal(&app)
}

/// Update the app configuration
#[tauri::command]
fn set_config(app: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    save_config_internal(&app, &config)
}

/// Get the app language from config (backward compatible API)
#[tauri::command]
fn get_app_language(app: tauri::AppHandle) -> Option<String> {
    let config = load_config_internal(&app);
    Some(config.language)
}

/// Set the app language in config (backward compatible API)
#[tauri::command]
fn set_app_language(app: tauri::AppHandle, language: &str) -> Result<(), String> {
    let mut config = load_config_internal(&app);
    config.language = language.to_string();
    save_config_internal(&app, &config)
}

/// Get the app theme from config
#[tauri::command]
fn get_app_theme(app: tauri::AppHandle) -> String {
    let config = load_config_internal(&app);
    config.theme
}

/// Set the app theme in config
#[tauri::command]
fn set_app_theme(app: tauri::AppHandle, theme: &str) -> Result<(), String> {
    let valid_themes = ["dark", "light", "system"];
    if !valid_themes.contains(&theme) {
        return Err(format!("Invalid theme: {}. Must be one of: dark, light, system", theme));
    }
    
    let mut config = load_config_internal(&app);
    config.theme = theme.to_string();
    save_config_internal(&app, &config)
}

/// Save window state (position, size, screen_mode)
#[tauri::command]
fn save_window_state(
    app: tauri::AppHandle,
    width: u32,
    height: u32,
    x: Option<i32>,
    y: Option<i32>,
    screen_mode: String,
) -> Result<(), String> {
    let mode = ScreenMode::from_str(&screen_mode)
        .ok_or_else(|| format!("Invalid screen_mode: {}. Must be one of: normal, maximized, fullscreen", screen_mode))?;
    
    let mut config = load_config_internal(&app);
    config.window = WindowConfig {
        width,
        height,
        x,
        y,
        screen_mode: mode,
    };
    save_config_internal(&app, &config)
}

/// Get window state from config
#[tauri::command]
fn get_window_state(app: tauri::AppHandle) -> WindowConfig {
    let config = load_config_internal(&app);
    config.window
}

/// Set auto-start setting
#[tauri::command]
fn set_auto_start(app: tauri::AppHandle, enabled: bool) -> Result<(), String> {
    let mut config = load_config_internal(&app);
    config.startup.auto_start = enabled;
    save_config_internal(&app, &config)
}

/// Get auto-start setting
#[tauri::command]
fn get_auto_start(app: tauri::AppHandle) -> bool {
    let config = load_config_internal(&app);
    config.startup.auto_start
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--autostarted"]),
        ))
        .invoke_handler(tauri::generate_handler![
            greet,
            get_config,
            set_config,
            get_app_language,
            set_app_language,
            get_app_theme,
            set_app_theme,
            save_window_state,
            get_window_state,
            set_auto_start,
            get_auto_start,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
