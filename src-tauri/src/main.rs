#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use ::phf::{phf_map, Map};
use mypanda::feed_fetcher::FeedFetcher;
use tauri::Manager;
use std::{collections::HashMap, str, sync::Mutex};

struct Storage {
    store: Mutex<HashMap<String, String>>,
}

static SITES: Map<&'static str, &'static str> = phf_map! {
    "hackernews" => "https://news.ycombinator.com/rss",
    "reddit" => "https://www.reddit.com/r/news/.rss",
    "github_trending" => "https://github-rss.alexi.sh/feeds/daily/all.xml",
    "verge" => "https://www.theverge.com/rss/index.xml",
};

#[tauri::command(async)]
async fn fetch_feeds(
    site: String,
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, String> {
    let url = SITES.get(&site).cloned().unwrap();

    if !force {
        if let Some(v) = storage.store.lock().unwrap().get(url) {
            return Ok(v.to_string());
        }
    }

    let v = FeedFetcher::execute(url)
        .await
        .map_err(|err| err.to_string())?;

    storage
        .store
        .lock()
        .unwrap()
        .insert(url.to_string(), v.to_string());
    Ok(v)
}

#[tauri::command]
async fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

fn main() {
    env_logger::init();
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .manage(Storage {
            store: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![close_window, fetch_feeds,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
