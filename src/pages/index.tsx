import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../components/feeds";
import Feeds from "../components/feeds";
import Feed from "../types/Feed";

function App() {
  const [hackernewsFeeds, sethackernewsFeeds] = useState("");
  const [redditFeeds, setRedditFeeds] = useState("");
  const [githubTrendingFeeds, setGithubTrendingFeeds] = useState("");
  const [vergeFeeds, setVergeFeeds] = useState("");
  const [hackernewsError, sethackernewsError] = useState("");
  const [redditError, setRedditError] = useState("");
  const [githubTrendingError, setGithubTrendingError] = useState("");
  const [vergeError, setVergeError] = useState("");
  const sites = {
    hackernews: { functions: [sethackernewsFeeds, sethackernewsError], state: hackernewsFeeds },
    reddit: { functions: [setRedditFeeds, setRedditError], state: redditFeeds, },
    github_trending: { functions: [setGithubTrendingFeeds, setGithubTrendingError], state: githubTrendingFeeds },
    verge: { functions: [setVergeFeeds, setVergeError], state: vergeFeeds },
  };

  useEffect(() => {
    (async () => {
      Object.keys(sites).forEach(async (site) => {
        const obj = sites[site];
        if (obj["state"].length === 0) {
          await fetchFeeds(site);
        }
      })
    })();

    document.addEventListener("keydown", onKeyDown);
  }, []);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "w" && event.ctrlKey) {
      await invoke("close_window");
    }
  };

  const fetchFeeds = async (site: string) => {
    const functions = sites[site]["functions"];
    try {
      const feeds = await invoke(`fetch_${site}_feeds`);
      functions[0](feeds as string);
      functions[1]("");
    } catch (err) {
      functions[1](err);
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
              await fetchFeeds("hackernews");
            }}
          >
            <h4 className="font-bold text-[#ff6600]">Hacker News</h4>
          </a>
          <Feeds
            feeds={parseFeeds(hackernewsFeeds)}
            error={hackernewsError}
            borderColor="border-[#ff6600]"
          />
        </div>
        <div className="flex-2 mb-10 mr-10">
          <a
            href="#"
            onClick={async () => {
              await fetchFeeds("reddit");
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
              await fetchFeeds("gihub_feed");
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
              await fetchFeeds("verge");
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
