import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

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

  const parsedHackewnewsFeeds = () => {
    if (hackewnewsFeeds.length === 0 ) return [];
    return JSON.parse(hackewnewsFeeds);
  }

  const parsedReddtFeeds = () => {
    if (redditFeeds.length === 0 ) return [];
    return JSON.parse(redditFeeds);
  }

  return (
    <div className="container">
      <h1 className="text-3xl text-red-300 font-bold underline mb-10">Yomu</h1>
      <div className="flex flex-row">
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff6600]">Hacker News</h4>
          {parsedHackewnewsFeeds().map((feed) => (
            <div className="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 text-left mb-1">
              <a href={feed.link} target="_blank" rel="noopener noreferrer" >
                <h5 className="mb-1 hover:underline text-gray-900">{feed.title}</h5>
              </a>
              <a href={feed.comments} target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-right text-gray-500 hover:underline">
                Comments
              </a>
            </div>
          ))}
        </div>
        <div className="flex-2 mb-10 mr-10">
          <h4 className="font-bold text-[#ff4500]">Reddit</h4>
          {parsedReddtFeeds().map((feed) => (
            <div className="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 text-left mb-1">
              <a href={feed.link} target="_blank" rel="noopener noreferrer" >
                <h5 className="mb-1 hover:underline text-gray-900">{feed.title}</h5>
              </a>
              <a href={feed.comments} target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-right text-gray-500 hover:underline">
                Comments
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
