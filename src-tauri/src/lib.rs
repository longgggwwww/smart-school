// Core modules
mod common;
mod config;
mod window;

// Feature modules
mod auth;

use auth::{clear_session, get_current_user, validate_token};
use config::{
    get_app_language, get_app_theme, get_auto_start, get_config, get_nfc_enabled,
    get_remember_me_default, get_window_state, greet, save_window_state, set_app_language,
    set_app_theme, set_auto_start, set_config, set_nfc_enabled, set_remember_me_default,
};
use window::{close_window, logout_to_auth, minimize_window, open_main_window};

/// Check if backend connection is available
/// Returns true if connected, false otherwise
#[tauri::command]
fn check_connection() -> bool {
    // For now, always return true since we're running locally
    // In production, this could ping a backend server
    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--autostarted"]),
        ))
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
             #[cfg(desktop)]
             {
                 use tauri_plugin_shell::ShellExt;

                 // Check if the server sidecar should be started based on the configuration
                 // Pass reference to the handle since load_config expects &AppHandle
                 let config = config::load_config(&app.handle());
                 
                 if config.server.enable {
                     let sidecar = app.shell().sidecar("server").unwrap();
                     let (mut _rx, child) = sidecar.spawn().unwrap();
                     
                     // Prevent the child process from being killed when `child` goes out of scope.
                     // The OS (Windows Job Object) will cleanup the subprocess when the main app exits.
                     // If we strictly rely on Drop to kill it, it dies immediately at end of setup.
                     std::mem::forget(child); 
                 }
             }
             Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            // Config commands
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
            get_remember_me_default,
            set_remember_me_default,
            get_nfc_enabled,
            set_nfc_enabled,
            // Window management
            open_main_window,
            logout_to_auth,
            close_window,
            minimize_window,
            // Auth commands
            validate_token,
            get_current_user,
            clear_session,
            // Utility commands
            check_connection,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
