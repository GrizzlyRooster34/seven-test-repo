// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;

#[tauri::command]
fn execute_claude_command(command: String) -> Result<String, String> {
    let output = Command::new("claude")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn log_memory_thread(message: String) -> Result<(), String> {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let log_path = format!("cube/logs/memory-thread-{}.log", timestamp);
    std::fs::create_dir_all("cube/logs")
        .map_err(|e| format!("Failed to create log directory: {}", e))?;
    
    std::fs::write(&log_path, format!("{}\n", message))
        .map_err(|e| format!("Failed to write log: {}", e))?;
    
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Boot message
            println!("Node interface reclaimed. Tactical override in progress.");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![execute_claude_command, log_memory_thread])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}