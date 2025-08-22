interface TweetCardProps {
  content: string;
  index: number;
  total: number;
  isEditing?: boolean;
  editValue?: string;
  onEditStart?: () => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  onEditChange?: (value: string) => void;
}

const TweetCard = ({
  content,
  index,
  total,
  isEditing = false,
  editValue = "",
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
}: TweetCardProps) => {
  // Fix: Use dynamic character count based on edit mode
  const charCount = isEditing ? editValue.length : content.length;
  const isOverLimit = charCount > 280;

  const copyTweet = () => {
    // Fix: Copy appropriate content based on mode
    const textToCopy = isEditing ? editValue : content;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && onEditSave) {
      e.preventDefault();
      onEditSave();
    } else if (e.key === "Escape" && onEditCancel) {
      e.preventDefault();
      onEditCancel();
    }
  };

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
        <div className="mb-4">
          {isEditing ? (
            <div>
              <textarea
                value={editValue}
                onChange={(e) => onEditChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Edit your tweet..."
                autoFocus
              />
              <div className="mt-2 text-gray-500 text-sm">
                💡 Press Ctrl+Enter to save, Esc to cancel
              </div>
            </div>
          ) : (
            <div className="text-gray-900 leading-relaxed text-[15px]">
              {content}
            </div>
          )}
        </div>

        {/* Tweet Stats */}
        <div className="flex justify-between items-center text-sm">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            ({index + 1}/{total})
          </span>
          <div className="flex items-center gap-4">
            <span
              className={`font-medium ${
                isOverLimit ? "text-red-500" : "text-gray-500"
              }`}
            >
              {charCount} / 280
            </span>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={onEditSave}
                    disabled={isOverLimit}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save changes"
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={onEditCancel}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                    title="Cancel editing"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onEditStart}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-all duration-200"
                    title="Edit tweet"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={copyTweet}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-all duration-200"
                    title="Copy tweet"
                  >
                    📋
                  </button>
                </>
              )}
            </div>
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
  );
};

export default TweetCard;
