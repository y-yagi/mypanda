const Feeds = ({ feeds }) => {
    return (
        <>
            {feeds.map((feed) => (
                <div className="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 text-left mb-1">
                    <a href={feed.link} target="_blank" rel="noopener noreferrer" >
                        <h5 className="mb-1 hover:underline text-gray-900">{feed.title}</h5>
                    </a>
                    {feed.comments.length > 0 &&
                        <a href={feed.comments} target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-right text-gray-500 hover:underline">
                            Comments
                        </a>
                    }
                </div>
            ))}
        </>
    );
};

export default Feeds;