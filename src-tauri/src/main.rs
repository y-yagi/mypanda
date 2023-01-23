#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::error::Error;
use serde::{Deserialize, Serialize};
use std::{thread, time, fs, str, collections::HashMap, sync::Mutex};

 struct Storage {
   store: Mutex<HashMap<String, String>>,
 }

#[derive(Debug, Serialize, Deserialize)]
struct FeedItem {
    title: String,
    link: String,
    description: String,
    comments: String,
}

fn fetch_feeds_from_url(url: &str) -> Result<String, Box<dyn Error>> {
    let body = reqwest::blocking::get(url)?.bytes()?;
    Ok(str::from_utf8(&body)?.to_string())
}

fn fetch_feeds_from_file(path: &str) -> Result<String, Box<dyn Error>> {
    Ok(fs::read_to_string(path)?)
}

fn fetch_feeds(url: &str, storage: tauri::State<Storage>) -> String {
    match storage.store.lock().unwrap().get(url) {
        Some(v) => return v.to_string(),
        None => {}
    }

    let body= match fetch_feeds_from_url(url).unwrap().parse::<syndication::Feed>() {
        Ok(v) => v,
        Err(_e) => {
            thread::sleep(time::Duration::from_secs(5));
            fetch_feeds_from_url(url).unwrap().parse::<syndication::Feed>().unwrap()
        },
    };

    let feed_items: Vec<FeedItem> = match body {
        syndication::Feed::Atom(atom_feed) => {
            atom_feed.entries().iter().map(|entry| FeedItem {
                title: entry.title().to_string(),
                description: "".to_string(),
                link: entry.links()[0].href().to_string(),
                comments: "".to_string(),
            }).collect()
        }
        syndication::Feed::RSS(rss_feed) => {
            rss_feed.items().iter().map(|item| FeedItem {
                title: item.title().unwrap_or_default().to_string(),
                description: item.description().unwrap_or_default().to_string(),
                link: item.link().unwrap_or_default().to_string(),
                comments: item.comments().unwrap_or_default().to_string(),
            }).collect()
        }
    };

    let v = serde_json::to_string(&feed_items).unwrap();
    storage.store.lock().unwrap().insert(url.to_string(), v.to_string());
    v
}

#[tauri::command]
fn fetch_hackernews_feeds(storage: tauri::State<Storage>) -> String {
    fetch_feeds("https://news.ycombinator.com/rss", storage)
}

#[tauri::command]
fn fetch_reddit_feeds(storage: tauri::State<Storage>) -> String {
    fetch_feeds("https://www.reddit.com/r/news/.rss", storage)
}

#[tauri::command]
fn fetch_github_trending_feeds(storage: tauri::State<Storage>) -> String {
    fetch_feeds("https://github-rss.alexi.sh/feeds/daily/all.xml", storage)
}

fn main() {
    tauri::Builder::default()
        .manage(Storage { store: Default::default() })
        .invoke_handler(tauri::generate_handler![fetch_hackernews_feeds, fetch_reddit_feeds, fetch_github_trending_feeds])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
