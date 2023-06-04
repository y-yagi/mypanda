use serde::{Deserialize, Serialize};
use std::error::Error;
use std::str;

pub struct FeedFetcher {}

#[derive(Debug, Serialize, Deserialize)]
struct FeedItem {
    title: String,
    link: String,
    description: String,
    comments: String,
}

impl FeedFetcher {
    pub async fn execute(url: &str) -> Result<String, Box<dyn Error>> {
        let client = reqwest::Client::builder()
            .user_agent("MyPanda 0.1")
            .build()?;
        let response = client.get(url).send().await?.bytes().await?;
        let body = str::from_utf8(&response)?
            .to_string()
            .parse::<syndication::Feed>()?;

        let feed_items: Vec<FeedItem> = match body {
            syndication::Feed::Atom(atom_feed) => atom_feed
                .entries()
                .iter()
                .map(|entry| FeedItem {
                    title: entry.title().to_string(),
                    description: "".to_string(),
                    link: entry.links()[0].href().to_string(),
                    comments: "".to_string(),
                })
                .collect(),
            syndication::Feed::RSS(rss_feed) => rss_feed
                .items()
                .iter()
                .map(|item| FeedItem {
                    title: item.title().unwrap_or_default().to_string(),
                    description: item.description().unwrap_or_default().to_string(),
                    link: item.link().unwrap_or_default().to_string(),
                    comments: item.comments().unwrap_or_default().to_string(),
                })
                .collect(),
        };

        Ok(serde_json::to_string(&feed_items)?)
    }
}
