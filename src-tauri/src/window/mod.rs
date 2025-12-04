use tauri::Manager;

/// Opens the main dashboard window and closes the login window
#[tauri::command]
pub async fn open_main_window(app: tauri::AppHandle) -> Result<(), String> {
    // Try to get existing main window, or create a new one
    let main_window = match app.get_webview_window("main") {
        Some(window) => window,
        None => {
            // Create new main window if it doesn't exist
            tauri::WebviewWindowBuilder::new(
                &app,
                "main",
                tauri::WebviewUrl::App("/dashboard".into()),
            )
            .title("Smart School")
            .inner_size(1200.0, 800.0)
            .min_inner_size(800.0, 600.0)
            .resizable(true)
            .center()
            .decorations(true)
            .visible(false)
            .build()
            .map_err(|e| e.to_string())?
        }
    };

    // Show and focus main window
    main_window.show().map_err(|e| e.to_string())?;
    main_window.set_focus().map_err(|e| e.to_string())?;

    // Close login window
    if let Some(login_window) = app.get_webview_window("login") {
        login_window.close().map_err(|e| e.to_string())?;
    }

    Ok(())
}

/// Logs out from dashboard and returns to login window
#[tauri::command]
pub async fn logout_to_login(app: tauri::AppHandle) -> Result<(), String> {
    // Create and show new login window
    let login_window = tauri::WebviewWindowBuilder::new(
        &app,
        "login",
        tauri::WebviewUrl::App("/".into()),
    )
    .title("Smart School - Login")
    .inner_size(450.0, 600.0)
    .resizable(false)
    .center()
    .decorations(false)
    .build()
    .map_err(|e| e.to_string())?;

    login_window.show().map_err(|e| e.to_string())?;
    login_window.set_focus().map_err(|e| e.to_string())?;

    // Close main window
    if let Some(main_window) = app.get_webview_window("main") {
        main_window.close().map_err(|e| e.to_string())?;
    }

    Ok(())
}

/// Close a specific window by label
#[tauri::command]
pub async fn close_window(app: tauri::AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Minimize a specific window by label
#[tauri::command]
pub async fn minimize_window(app: tauri::AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.minimize().map_err(|e| e.to_string())?;
    }
    Ok(())
}
