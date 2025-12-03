use super::{load_config, save_config, AppConfig, ConfigError, ScreenMode, Theme, WindowConfig};

/// Get the full app configuration
#[tauri::command]
pub fn get_config(app: tauri::AppHandle) -> AppConfig {
    load_config(&app)
}

/// Update the app configuration
#[tauri::command]
pub fn set_config(app: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    save_config(&app, &config).map_err(|e| e.to_string())
}

/// Get the app language from config
#[tauri::command]
pub fn get_app_language(app: tauri::AppHandle) -> Option<String> {
    let config = load_config(&app);
    Some(config.language)
}

/// Set the app language in config
#[tauri::command]
pub fn set_app_language(app: tauri::AppHandle, language: &str) -> Result<(), String> {
    let mut config = load_config(&app);
    config.language = language.to_string();
    save_config(&app, &config).map_err(|e| e.to_string())
}

/// Get the app theme from config
#[tauri::command]
pub fn get_app_theme(app: tauri::AppHandle) -> String {
    let config = load_config(&app);
    config.theme.as_str().to_string()
}

/// Set the app theme in config
#[tauri::command]
pub fn set_app_theme(app: tauri::AppHandle, theme: &str) -> Result<(), String> {
    let valid_theme = Theme::from_str(theme).ok_or_else(|| {
        ConfigError::InvalidValue(format!(
            "Invalid theme: {}. Must be one of: dark, light, system",
            theme
        ))
        .to_string()
    })?;

    let mut config = load_config(&app);
    config.theme = valid_theme;
    save_config(&app, &config).map_err(|e| e.to_string())
}

/// Save window state (position, size, screen_mode)
#[tauri::command]
pub fn save_window_state(
    app: tauri::AppHandle,
    width: u32,
    height: u32,
    x: Option<i32>,
    y: Option<i32>,
    screen_mode: String,
) -> Result<(), String> {
    let mode = ScreenMode::from_str(&screen_mode).ok_or_else(|| {
        ConfigError::InvalidValue(format!(
            "Invalid screen_mode: {}. Must be one of: normal, maximized, fullscreen",
            screen_mode
        ))
        .to_string()
    })?;

    let mut config = load_config(&app);
    config.window = WindowConfig {
        width,
        height,
        x,
        y,
        screen_mode: mode,
    };
    save_config(&app, &config).map_err(|e| e.to_string())
}

/// Get window state from config
#[tauri::command]
pub fn get_window_state(app: tauri::AppHandle) -> WindowConfig {
    let config = load_config(&app);
    config.window
}

/// Set auto-start setting
#[tauri::command]
pub fn set_auto_start(app: tauri::AppHandle, enabled: bool) -> Result<(), String> {
    let mut config = load_config(&app);
    config.startup.auto_start = enabled;
    save_config(&app, &config).map_err(|e| e.to_string())
}

/// Get auto-start setting
#[tauri::command]
pub fn get_auto_start(app: tauri::AppHandle) -> bool {
    let config = load_config(&app);
    config.startup.auto_start
}

/// Simple greet command for testing
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
