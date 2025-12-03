// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Get the app language from Windows Registry.
/// Priority: UserLanguage (user selected) > InstallerLanguage (from installer)
/// Returns the language code (e.g., "vi", "en") or None if not found.
#[tauri::command]
fn get_app_language() -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        use winreg::enums::HKEY_CURRENT_USER;
        use winreg::RegKey;
        
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(app_key) = hkcu.open_subkey("Software\\SmartClassroom") {
            // First try to get user-selected language
            if let Ok(lang) = app_key.get_value::<String, _>("UserLanguage") {
                return Some(lang);
            }
            // Fall back to installer language
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

/// Save the user-selected language to Windows Registry.
/// This persists the language preference across app restarts.
#[tauri::command]
fn set_app_language(language: &str) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use winreg::enums::HKEY_CURRENT_USER;
        use winreg::RegKey;
        
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let (app_key, _) = hkcu
            .create_subkey("Software\\SmartClassroom")
            .map_err(|e| format!("Failed to create registry key: {}", e))?;
        
        app_key
            .set_value("UserLanguage", &language)
            .map_err(|e| format!("Failed to set registry value: {}", e))?;
        
        Ok(())
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        let _ = language;
        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_app_language, set_app_language])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
