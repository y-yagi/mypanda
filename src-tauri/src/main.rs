#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::error::Error;
use std::{collections::HashMap, str, sync::Mutex};
use yomu_tauri::feed_fetcher::FeedFetcher;
use tauri::Manager;

struct Storage {
    store: Mutex<HashMap<String, String>>,
}

async fn fetch_feeds(
    url: &str,
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, Box<dyn Error>> {
    if !force {
        if let Some(v) = storage.store.lock().unwrap().get(url) {
            return Ok(v.to_string());
        }
    }

    let v = FeedFetcher::execute(url).await?;

    storage
        .store
        .lock()
        .unwrap()
        .insert(url.to_string(), v.to_string());
    Ok(v)
}

#[tauri::command(async)]
async fn fetch_hackernews_feeds(
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, String> {
    log::info!("call `fetch_hackernews_feeds`");
    fetch_feeds("https://news.ycombinator.com/rss", force, storage)
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command(async)]
async fn fetch_reddit_feeds(
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, String> {
    log::info!("call `fetch_reddit_feeds`");
    fetch_feeds("https://www.reddit.com/r/news/.rss", force, storage)
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command(async)]
async fn fetch_github_trending_feeds(
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, String> {
    log::info!("call `fetch_github_trending_feeds`");
    fetch_feeds(
        "https://github-rss.alexi.sh/feeds/daily/all.xml",
        force,
        storage,
    )
    .await
    .map_err(|err| err.to_string())
}

#[tauri::command(async)]
async fn fetch_verge_feeds(
    force: bool,
    storage: tauri::State<'_, Storage>,
) -> Result<String, String> {
    log::info!("call `fetch_verge_feeds`");
    fetch_feeds("https://www.theverge.com/rss/index.xml", force, storage)
        .await
        .map_err(|err| err.to_string())
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
            window.maximize().unwrap();
            Ok(())
        })
        .manage(Storage {
            store: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            close_window,
            fetch_hackernews_feeds,
            fetch_reddit_feeds,
            fetch_github_trending_feeds,
            fetch_verge_feeds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
