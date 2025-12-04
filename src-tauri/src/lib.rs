mod config;
mod window;

use config::{
    get_app_language, get_app_theme, get_auto_start, get_config, get_window_state, greet,
    save_window_state, set_app_language, set_app_theme, set_auto_start, set_config,
};
use window::{close_window, logout_to_auth, minimize_window, open_main_window};

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
            // Window management
            open_main_window,
            logout_to_auth,
            close_window,
            minimize_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
