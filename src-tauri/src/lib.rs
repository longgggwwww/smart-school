// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Get the installer language from Windows Registry.
/// This is set by the WiX installer during installation.
/// Returns the language code (e.g., "vi", "en") or None if not found.
#[tauri::command]
fn get_installer_language() -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        use winreg::enums::HKEY_CURRENT_USER;
        use winreg::RegKey;
        
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(app_key) = hkcu.open_subkey("Software\\SmartClassroom") {
            if let Ok(lang) = app_key.get_value::<String, _>("InstallerLanguage") {
                return Some(lang);
            }
        }
        None
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        None
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_installer_language])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
