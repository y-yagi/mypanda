import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../components/feeds";
import Feeds from "../components/feeds";

function App() {
  const [hackewnewsFeeds, setHackewnewsFeeds] = useState("");
  const [redditFeeds, setRedditFeeds] = useState("");

  useEffect(() => {
    (async () => {
      if (hackewnewsFeeds.length === 0) {
        const feeds = await invoke("fetch_hackernews_feeds");
        setHackewnewsFeeds(feeds);
      }

      if (redditFeeds.length === 0) {
        const feeds = await invoke("fetch_reddit_feeds");
        setRedditFeeds(feeds);
      }
    })();
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  const parseFeeds = (feeds) => {
    if (feeds.length === 0 ) return [];
    return JSON.parse(feeds);
  }

  return (
    <div className="container">
      <h1 className="text-3xl text-red-300 font-bold underline mb-10">Yomu</h1>
      <div className="flex flex-row">
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff6600]">Hacker News</h4>
          <Feeds feeds={parseFeeds(hackewnewsFeeds)} />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff4500]">Reddit</h4>
          <Feeds feeds={parseFeeds(redditFeeds)} />
        </div>
      </div>
    </div>
  );
}

export default App;
