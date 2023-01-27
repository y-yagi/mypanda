import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../components/feeds";
import Feeds from "../components/feeds";
import Feed from "../types/Feed";

function App() {
  const [hackewnewsFeeds, setHackewnewsFeeds] = useState("");
  const [redditFeeds, setRedditFeeds] = useState("");
  const [githubTrendingFeeds, setGithubTrendingFeeds] = useState("");
  const [vergeFeeds, setVergeFeeds] = useState("");
  const [hackewnewsError, setHackewnewsError] = useState("");
  const [redditError, setRedditError] = useState("");
  const [githubTrendingError, setGithubTrendingError] = useState("");
  const [vergeError, setVergeError] = useState("");

  useEffect(() => {
    (async () => {
      if (hackewnewsFeeds.length === 0) {
        await fetchHackenewsFeed();
      }

      if (redditFeeds.length === 0) {
        await fetchRedditFeed();
      }

      if (githubTrendingFeeds.length === 0) {
        await fetchGithubFeed();
      }

      if (vergeFeeds.length === 0) {
        await fetchVergeFeed();
      }
    })();

    document.addEventListener("keydown", onKeyDown);
  }, []);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "w" && event.ctrlKey) {
      await invoke("close_window");
    }
  };

  const fetchHackenewsFeed = async () => {
    try {
      const feeds = await invoke("fetch_hackernews_feeds");
      setHackewnewsFeeds(feeds as string);
      setHackewnewsError("");
    } catch (err) {
      setHackewnewsError(err);
    }
  };

  const fetchRedditFeed = async () => {
    try {
      const feeds = await invoke("fetch_reddit_feeds");
      setRedditFeeds(feeds as string);
      setRedditError("");
    } catch (err) {
      setRedditError(err);
    }
  };

  const fetchGithubFeed = async () => {
    try {
      const feeds = await invoke("fetch_github_trending_feeds");
      setGithubTrendingFeeds(feeds as string);
      setGithubTrendingError("");
    } catch (err) {
      setGithubTrendingError(err);
    }
  };

  const fetchVergeFeed = async () => {
    try {
      const feeds = await invoke("fetch_verge_feeds");
      setVergeFeeds(feeds as string);
      setVergeError("");
    } catch (err) {
      setVergeError(err);
    }
  };

  const parseFeeds = (feeds: string): Feed[] => {
    if (feeds.length === 0) return [];
    return JSON.parse(feeds) as Feed[];
  };

  return (
    <div className="container">
      <h1 className="text-3xl text-red-300 font-bold underline mb-10">Yomu</h1>
      <div className="flex flex-row">
        <div className="flex-2 mb-10 mr-10">
          <a
            href="#"
            onClick={async () => {
              await fetchHackenewsFeed();
            }}
          >
            <h4 className="font-bold text-[#ff6600]">Hacker News</h4>
          </a>
          <Feeds
            feeds={parseFeeds(hackewnewsFeeds)}
            error={hackewnewsError}
            borderColor="border-[#ff6600]"
          />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <a
            href="#"
            onClick={async () => {
              await fetchRedditFeed();
            }}
          >
            <h4 className="font-bold text-[#ff4500]">Reddit</h4>
          </a>
          <Feeds
            feeds={parseFeeds(redditFeeds)}
            error={redditError}
            borderColor="border-[#ff4500]"
          />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <a
            href="#"
            onClick={async () => {
              await fetchGithubFeed();
            }}
          >
            <h4 className="font-bold text-[#24292f]">GitHub Trending</h4>
          </a>
          <Feeds
            feeds={parseFeeds(githubTrendingFeeds)}
            error={githubTrendingError}
            borderColor="border-[#24292f]"
          />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <a
            href="#"
            onClick={async () => {
              await fetchVergeFeed();
            }}
          >
            <h4 className="font-bold text-[#5100ff]">Verge</h4>
          </a>
          <Feeds
            feeds={parseFeeds(vergeFeeds)}
            error={vergeError}
            borderColor="border-[#5100ff]"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
