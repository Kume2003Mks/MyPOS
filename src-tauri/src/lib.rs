use tauri_plugin_sql::{Migration, MigrationKind};
use bcrypt::{hash, verify, DEFAULT_COST};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn hash_password(password: String, cost: Option<u32>) -> Result<String, String> {
    let cost: u32 = cost.unwrap_or(DEFAULT_COST);
    hash(password, cost)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn verify_password(password: String, hash: String) -> Result<bool, String> {
    verify(password, &hash)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: include_str!("../migrations/schema.sql"),
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:database.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet,verify_password,hash_password])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
