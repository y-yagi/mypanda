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
    hackernews: {
      name: "Hacker News",
      functions: [sethackernewsFeeds, sethackernewsError],
      state: hackernewsFeeds,
      error: hackernewsError,
      textColor: "text-[#ff6600]",
      borderColor: "border-[#ff6600]",
    },
    reddit: {
      name: "Reddit",
      functions: [setRedditFeeds, setRedditError],
      state: redditFeeds,
      error: redditError,
      textColor: "text-[#ff4500]",
      borderColor: "border-[#ff4500]",
    },
    github_trending: {
      name: "GitHub Trending",
      functions: [setGithubTrendingFeeds, setGithubTrendingError],
      state: githubTrendingFeeds,
      error: githubTrendingError,
      textColor: "text-[#24292f]",
      borderColor: "border-[#24292f]",
    },
    verge: {
      name: "Verge",
      functions: [setVergeFeeds, setVergeError],
      state: vergeFeeds,
      error: vergeError,
      textColor: "text-[#5100ff]",
      borderColor: "border-[#5100ff]",
    },
  };

  useEffect(() => {
    (async () => {
      Object.keys(sites).forEach(async (site) => {
        const obj = sites[site];
        if (obj["state"].length === 0) {
          await fetchFeeds(site, false);
        }
      });
    })();

    document.addEventListener("keydown", onKeyDown);
  }, []);

  const onKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "w" && event.ctrlKey) {
      await invoke("close_window");
    }
  };

  const fetchFeeds = async (site: string, force: boolean) => {
    const functions = sites[site]["functions"];
    try {
      const feeds = await invoke(`fetch_feeds`, { site: site, force: force });
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
        {Object.keys(sites).map((site, index) => (
          <div className="flex-2 mb-10 mr-10" key={index}>
            <a
              href="#"
              onClick={async () => {
                await fetchFeeds(site, true);
              }}
              title="reload feeds"
            >
              <h4 className={`font-bold ${sites[site]["textColor"]}`}>
                {sites[site]["name"]}
              </h4>
            </a>
            <Feeds
              feeds={parseFeeds(sites[site]["state"])}
              error={sites[site]["error"]}
              borderColor={sites[site]["borderColor"]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
