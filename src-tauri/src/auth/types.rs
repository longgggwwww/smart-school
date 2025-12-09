//! Authentication Types
//! Data structures for authentication

use serde::{Deserialize, Serialize};

/// User role types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum UserRoleType {
    SuperAdmin,
    Admin,
    Teacher,
    Student,
}

/// Authenticated user information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthUser {
    pub id: String,
    pub username: String,
    pub email: Option<String>,
    pub full_name: Option<String>,
    pub role_type: UserRoleType,
    pub avatar_url: Option<String>,
    pub permissions: Vec<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

/// Login request payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
    pub remember_me: Option<bool>,
}

/// Login response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
    pub user: AuthUser,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: u64,
}

/// Token refresh response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshTokenResponse {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: u64,
}

/// Auth error types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuthErrorKind {
    InvalidCredentials,
    TokenExpired,
    TokenInvalid,
    UserNotFound,
    UserDisabled,
    NetworkError,
    Unknown,
}

/// Auth error
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthError {
    pub kind: AuthErrorKind,
    pub message: String,
}

impl std::fmt::Display for AuthError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}: {}", self.kind, self.message)
    }
}

impl std::error::Error for AuthError {}
