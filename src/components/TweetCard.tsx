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
        <div className="absolute left-8 top-20 w-0.5 h-6 bg-gradient-to-b from-cyan-400/40 to-blue-400/40 z-0"></div>
      )}

      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 mb-4 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 relative z-10 hover:border-cyan-400/30 hover:shadow-cyan-400/15 transition-all duration-300">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-cyan-400/20">
            <span className="text-cyan-300 font-bold text-lg">👤</span>
          </div>
          <div>
            <div className="font-bold text-white">You</div>
            <div className="text-cyan-300/70 text-sm">@your_handle</div>
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
                className="w-full p-4 bg-black/60 backdrop-blur-sm text-white border border-cyan-400/30 rounded-xl focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-gray-400"
                rows={4}
                placeholder="Edit your tweet..."
                autoFocus
              />
              <div className="mt-3 text-cyan-300/70 text-sm flex items-center gap-2">
                <span className="text-lg">💡</span>
                Press Ctrl+Enter to save, Esc to cancel
              </div>
            </div>
          ) : (
            <div className="text-gray-100 leading-relaxed text-[15px] whitespace-pre-line">
              {content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')}
            </div>
          )}
        </div>

        {/* Tweet Stats */}
        <div className="flex justify-between items-center text-sm">
          <span className="bg-black/60 backdrop-blur-sm text-cyan-300 px-4 py-2 rounded-xl font-medium border border-cyan-400/20">
            ({index + 1}/{total})
          </span>
          <div className="flex items-center gap-4">
            <span
              className={`font-medium ${
                isOverLimit ? "text-red-400" : "text-gray-400"
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
                    className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-400/25 hover:shadow-green-400/40 flex items-center gap-2 text-sm font-medium"
                    title="Save changes"
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={onEditCancel}
                    className="bg-black/60 backdrop-blur-sm text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-600/50 transition-all duration-300 border border-gray-500/30 hover:border-gray-400/40 flex items-center gap-2 text-sm font-medium"
                    title="Cancel editing"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onEditStart}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-cyan-400/20"
                    title="Edit tweet"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={copyTweet}
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-cyan-400/20"
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
          <div className="mt-4 text-red-300 text-sm font-medium bg-red-900/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-red-500/30 flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            Tweet exceeds 280 character limit
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetCard;
