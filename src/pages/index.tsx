import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../components/feeds";
import Feeds from "../components/feeds";
import Feed from "../types/Feed";

function App() {
  const [hackewnewsFeeds, setHackewnewsFeeds] = useState("");
  const [redditFeeds, setRedditFeeds] = useState("");
  const [githubTrendingFeeds, setGithubTrendingFeeds] = useState("");
  const [hackewnewsError, setHackewnewsError] = useState("");
  const [redditError, setRedditError] = useState("");
  const [githubTrendingError, setGithubTrendingError] = useState("");


  useEffect(() => {
    (async () => {
      if (hackewnewsFeeds.length === 0) {
        try {
          const feeds = await invoke("fetch_hackernews_feeds");
          setHackewnewsFeeds(feeds as string);
        } catch(err) {
          setGithubTrendingError(err);
        }
      }

      if (redditFeeds.length === 0) {
        try {
          const feeds = await invoke("fetch_reddit_feeds");
          setRedditFeeds(feeds as string);
        } catch(err) {
          setRedditError(err);
        }
      }

      if (githubTrendingFeeds.length === 0) {
        try {
          const feeds = await invoke("fetch_github_trending_feeds");
          setGithubTrendingFeeds(feeds as string);
        } catch(err) {
          setGithubTrendingError(err);
        }
      }
    })();
  }, []);

  const parseFeeds = (feeds: string): Feed[] => {
    if (feeds.length === 0 ) return [];
    return JSON.parse(feeds) as Feed[];
  }

  return (
    <div className="container">
      <h1 className="text-3xl text-red-300 font-bold underline mb-10">Yomu</h1>
      <div className="flex flex-row">
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff6600]">Hacker News</h4>
          <Feeds feeds={parseFeeds(hackewnewsFeeds)} error={hackewnewsError} />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff4500]">Reddit</h4>
          <Feeds feeds={parseFeeds(redditFeeds)} error={redditError} />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#24292f]">GitHub Trending</h4>
          <Feeds feeds={parseFeeds(githubTrendingFeeds)} error={githubTrendingError} />
        </div>
      </div>
    </div>
  );
}

export default App;
