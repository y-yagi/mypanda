import React from "react";
import Feed from "../types/Feed";

type Props = {
  feeds: Feed[];
  error: string;
  borderColor: string;
};

const Feeds = ({ feeds, error, borderColor }: Props) => {
  return (
    <>
      {error.length > 0 && (
        <div role="alert" className="mb-2">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Error
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{error}</p>
          </div>
        </div>
      )}
      {feeds.map((feed, index) => (
        <div
          className={`max-w-sm p-1 bg-white border ${borderColor} rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 text-left mb-1`}
          key={index}
        >
          <a href={feed.link} target="_blank" rel="noopener noreferrer">
            <h5 className="text-sm mb-1 hover:underline text-gray-900">
              {feed.title}
            </h5>
          </a>
          {/* Hacker News has a link for comments in both `description` and `comments` tags. This check needs to show only one link. */}
          {feed.description.length > 0 && feed.comments.length === 0 && (
            <p className="text-xs inline-flex items-right text-gray-500">
              {feed.description}
            </p>
          )}
          {feed.comments.length > 0 && (
            <a
              href={feed.comments}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs inline-flex items-right text-gray-500 hover:underline"
            >
              Comments
            </a>
          )}
        </div>
      ))}
    </>
  );
};

export default Feeds;
