interface TweetCardProps {
    content: string;
    index: number;
    total: number;
}

const TweetCard = ({ content, index, total }: TweetCardProps) => {
    const charCount = content.length;
    const isOverLimit = charCount > 280;

    const copyTweet = () => {
        navigator.clipboard.writeText(content);
    }

  return (
    <div className="relative">
      {/* Connection line (except for last tweet) */}
      {index < total - 1 && (
        <div className="absolute left-6 top-20 w-0.5 h-6 bg-gray-400 z-0"></div>
      )}
      
      <div className="bg-white text-black rounded-xl p-5 mb-3 border border-gray-200 shadow-sm relative z-10">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">👤</span>
          </div>
          <div>
            <div className="font-bold text-gray-900">You</div>
            <div className="text-gray-500 text-sm">@your_handle</div>
          </div>
        </div>

        {/* Tweet Content */}
        <div className="text-gray-900 mb-4 leading-relaxed text-[15px]">
          {content}
        </div>

        {/* Tweet Stats */}
        <div className="flex justify-between items-center text-sm">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            ({index + 1}/{total})
          </span>
          <div className="flex items-center gap-4">
            <span className={`font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount} / 280
            </span>
            <button
              onClick={copyTweet}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-all duration-200"
              title="Copy tweet"
            >
              📋
            </button>
          </div>
        </div>

        {/* Over limit warning */}
        {isOverLimit && (
          <div className="mt-3 text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded">
            ⚠️ Tweet exceeds 280 character limit
          </div>
        )}
      </div>
    </div>
  )
}

export default TweetCard