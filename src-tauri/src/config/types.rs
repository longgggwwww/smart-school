use serde::{Deserialize, Serialize};

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
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "normal" => Some(ScreenMode::Normal),
            "maximized" => Some(ScreenMode::Maximized),
            "fullscreen" => Some(ScreenMode::Fullscreen),
            _ => None,
        }
    }
}

/// Supported theme values
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Default)]
#[serde(rename_all = "lowercase")]
pub enum Theme {
    Dark,
    Light,
    #[default]
    System,
}

impl Theme {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "dark" => Some(Theme::Dark),
            "light" => Some(Theme::Light),
            "system" => Some(Theme::System),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            Theme::Dark => "dark",
            Theme::Light => "light",
            Theme::System => "system",
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

/// Authentication configuration
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AuthConfig {
    pub remember_me_default: bool,
    pub nfc_enabled: bool,
}

/// Startup configuration
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct StartupConfig {
    pub auto_start: bool,
}

/// Main application configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    /// Language code (e.g., "en", "vi")
    pub language: String,
    /// Theme setting
    #[serde(with = "theme_string")]
    pub theme: Theme,
    /// Window state (size, position, fullscreen)
    pub window: WindowConfig,
    /// Startup settings
    pub startup: StartupConfig,
    /// Authentication settings
    pub auth: AuthConfig,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            language: "en".to_string(),
            theme: Theme::System,
            window: WindowConfig::default(),
            startup: StartupConfig::default(),
            auth: AuthConfig::default(),
        }
    }
}

/// Custom serialization for Theme as string in YAML
mod theme_string {
    use super::Theme;
    use serde::{self, Deserialize, Deserializer, Serializer};

    pub fn serialize<S>(theme: &Theme, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(theme.as_str())
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Theme, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Theme::from_str(&s).ok_or_else(|| {
            serde::de::Error::custom(format!(
                "Invalid theme: {}. Must be one of: dark, light, system",
                s
            ))
        })
    }
}
