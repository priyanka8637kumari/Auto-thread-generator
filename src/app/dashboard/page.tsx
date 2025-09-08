"use client";

import TweetCard from "@/components/TweetCard";
import UserWelcome from "@/components/UserWelcome";
import { useState, useEffect } from "react";
import { 
  downloadThreadAsTxt, 
  downloadThreadAsCsv, 
  downloadThread,
  type ThreadData 
} from "@/lib/utils";
import { useSession, signIn } from "next-auth/react";
import { makeThreadUnique } from "@/lib/twitter";

// Define extended session type to include accessToken
interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
  accessToken?: string;
}

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [individualTweets, setIndividualTweets] = useState<string[]>([]); // Individual tweets array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index of tweet being edited
  const [editValue, setEditValue] = useState<string>(""); // Value for editing tweet
  const [showDownloadMenu, setShowDownloadMenu] = useState(false); // For dropdown menu
  const [showPostToTwitter, setShowPostToTwitter] = useState(false); // Post to Twitter modal
  const [successMessage, setSuccessMessage] = useState(""); // Success notifications
  const [isPosting, setIsPosting] = useState(false); // Posting state
  const [postingProgress, setPostingProgress] = useState(0); // Progress for bulk posting
  const [postingIndex, setPostingIndex] = useState<number | null>(null); // Which tweet is being posted
  const [showRetryWithUnique, setShowRetryWithUnique] = useState(false); // Show retry option for duplicates
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null); // Fallback Twitter username

  // Get session from NextAuth
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;

  // Debug session data
  useEffect(() => {
    if (session) {
      console.log('Current session data:', {
        user: session.user,
        hasAccessToken: !!session.accessToken,
        username: session.user?.username,
      });
    }
  }, [session]);

  // Fetch Twitter username if missing from session
  useEffect(() => {
    const fetchTwitterUsername = async () => {
      // Only fetch if we have an access token but no username
      if (session?.accessToken && !session?.user?.username && !twitterUsername) {
        console.log('Attempting to fetch Twitter username via API...');
        try {
          const response = await fetch('/api/twitter/profile', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          
          console.log('Profile API response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Profile API data:', data);
            if (data.username) {
              setTwitterUsername(data.username);
              console.log('Successfully set Twitter username:', data.username);
            }
          } else {
            const errorData = await response.json();
            console.error('Failed to fetch Twitter username:', errorData);
          }
        } catch (error) {
          console.error('Error fetching Twitter username:', error);
        }
      }
    };

    fetchTwitterUsername();
  }, [session?.accessToken, session?.user?.username, twitterUsername]);

  // Function to connect Twitter account
  const handleConnectTwitter = () => {
    signIn('twitter');
  };

  // Function to retry posting with unique content
  const handleRetryWithUniqueContent = async () => {
    if (individualTweets.length === 0) return;
    
    if (!session?.accessToken) {
      setError('Twitter access token not available. Please log in again.');
      return;
    }

    // Make tweets unique
    const uniqueTweets = makeThreadUnique(individualTweets);
    
    setIsPosting(true);
    setPostingProgress(0);
    setShowRetryWithUnique(false);
    setError(""); // Clear previous error

    try {
      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'thread',
          content: { tweets: uniqueTweets },
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle errors for retry attempt
        if (data.type === 'DUPLICATE_CONTENT') {
          setError(`${data.error} The content is still too similar. Try manually editing the tweets.`);
        } else {
          setError(data.error || 'Failed to post thread');
        }
        throw new Error(data.error || 'Failed to post thread');
      }

      setPostingProgress(100);
      setSuccessMessage(`Thread with ${uniqueTweets.length} tweets posted successfully with unique content!`);
      setTimeout(() => setSuccessMessage(""), 5000);
      setShowPostToTwitter(false);

    } catch (error) {
      console.error('Retry thread posting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post thread';
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setTimeout(() => {
        setIsPosting(false);
        setPostingProgress(0);
        setPostingIndex(null);
      }, 1000);
    }
  };

  // Function to parse raw thread text into individual tweets
  const parseThread = (rawThread: string): string[] => {
    if (!rawThread) return [];
    
    return rawThread
      .split('\n') // Split by line breaks
      .filter(line => line.trim() !== '') // Remove empty lines
      .map(tweet => {
        // Remove various numbering patterns
        return tweet
          .replace(/^\d+[\/\.\)\:]\s*/, '') // Remove "1/" "1." "1)" "1:"
          .replace(/^Thread\s+\d+\s*[:\-]\s*/i, '') // Remove "Thread 1:" or "Thread 1-"
          .replace(/^\*\*\d+\/\d+\*\*\s*/, '') // Remove "**1/5**" patterns
          .replace(/^\*\*\d+[\/\.\)]\*\*\s*/, '') // Remove "**1/**" "**1.**" etc.
          .replace(/^\*\*Tweet\s+\d+[:\*]*\s*/, '') // Remove "**Tweet 1:**" patterns
          .replace(/^Tweet\s+\d+[:\-\s]*/, '') // Remove "Tweet 1:" patterns
          .replace(/^\(\d+\/\d+\)\s*/, '') // Remove "(1/5)" patterns
          .replace(/^\[\d+\/\d+\]\s*/, '') // Remove "[1/5]" patterns
          .replace(/^\d+\/\d+\s*[\-\:]*\s*/, '') // Remove "1/5 -" or "1/5:" patterns
          .trim();
      })
      .filter(tweet => tweet.length > 0) // Remove empty tweets after cleaning
      .filter(tweet => !tweet.match(/^thread\s*$/i)) // Remove standalone "thread" lines
      .filter(tweet => !tweet.match(/^\d+\/\d+\s*$/)) // Remove standalone numbering like "1/5"
      .filter(tweet => !tweet.match(/^\*\*\d+\/\d+\*\*\s*$/)); // Remove standalone "**1/5**"
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditValue(individualTweets[index]);
  };

  const handleEditSave = (index: number) => {
    const updatedTweets = [...individualTweets];
    updatedTweets[index] = editValue;
    setIndividualTweets(updatedTweets);
    setEditingIndex(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleEditChange = (value: string) => {
    setEditValue(value);
  };

  // Copy entire thread function
  const copyEntireThread = () => {
    // const tweets = parseThread(thread);
    const threadText = individualTweets.map((tweet, index) => `${index + 1}/ ${tweet}`).join('\n\n');
    navigator.clipboard.writeText(threadText);
    // Optional: Add toast notification
  };

  // Copy thread for Twitter (with proper formatting)
  const copyForTwitter = () => {
    // const tweets = parseThread(thread);
    const twitterThread = individualTweets.map((tweet, index) => {
      if (index === 0) return tweet; // First tweet without numbering
      return `${index + 1}/ ${tweet}`;
    }).join('\n\n');
    navigator.clipboard.writeText(twitterThread);
  };

  // Universal download handler with format selection
  const handleDownload = (format: 'txt' | 'csv') => {
    if (individualTweets.length === 0) return;
    
    const threadData: ThreadData = {
      topic: topic || "Generated Thread",
      tone: tone,
      tweets: individualTweets,
      timestamp: new Date()
    };

    try {
      downloadThread(threadData, format, {
        includeMetadata: true,
        includeNumbering: format === 'txt',
        includeStats: true
      });
    } catch (error) {
      console.error('Download failed:', error);
      setError(`Failed to download ${format.toUpperCase()} file. Please try again.`);
    }
  };

  // Twitter posting handlers (using NextAuth session)
  const handlePostToTwitter = () => {
    setShowPostToTwitter(true);
  };

  const handlePostSingleTweet = async (index: number) => {
    if (!session?.accessToken) {
      setError('Twitter access token not available. Please log in again.');
      return;
    }

    setPostingIndex(index);
    setIsPosting(true);

    try {
      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          content: { text: individualTweets[index] },
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error types for better user feedback
        if (data.type === 'DUPLICATE_CONTENT') {
          throw new Error(`${data.error} Try modifying the tweet content.`);
        } else if (data.type === 'RATE_LIMIT') {
          throw new Error(`${data.error} You can try again in 15 minutes.`);
        } else if (data.type === 'AUTH_ERROR') {
          throw new Error(`${data.error} Please refresh the page and log in again.`);
        } else if (data.type === 'CHARACTER_LIMIT') {
          throw new Error(`${data.error} Please shorten your tweet.`);
        } else {
          throw new Error(data.error || 'Failed to post tweet');
        }
      }

      setSuccessMessage(`Tweet ${index + 1} posted successfully!`);
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (error) {
      console.error('Post failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post tweet';
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsPosting(false);
      setPostingIndex(null);
    }
  };

  const handlePostEntireThread = async () => {
    if (individualTweets.length === 0) return;
    
    if (!session?.accessToken) {
      setError('Twitter access token not available. Please log in again.');
      return;
    }

    setIsPosting(true);
    setPostingProgress(0);

    try {
      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'thread',
          content: { tweets: individualTweets },
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error types
        if (data.type === 'DUPLICATE_CONTENT') {
          setError(`${data.error} Try editing the content or click "Try with Unique Content" below.`);
          setShowRetryWithUnique(true);
        } else if (data.type === 'RATE_LIMIT') {
          setError(`${data.error} You can try again in 15 minutes.`);
          setShowRetryWithUnique(false);
        } else if (data.type === 'AUTH_ERROR') {
          setError(`${data.error} Please refresh the page and log in again.`);
          setShowRetryWithUnique(false);
        } else {
          setError(data.error || 'Failed to post thread');
          setShowRetryWithUnique(false);
        }
        throw new Error(data.error || 'Failed to post thread');
      }

      setPostingProgress(100);
      setSuccessMessage(`Thread with ${individualTweets.length} tweets posted successfully!`);
      setTimeout(() => setSuccessMessage(""), 5000);
      setShowPostToTwitter(false);

    } catch (error) {
      console.error('Thread posting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post thread';
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setTimeout(() => {
        setIsPosting(false);
        setPostingProgress(0);
        setPostingIndex(null);
      }, 1000);
    }
  };

  const handleCancelPosting = () => {
    setShowPostToTwitter(false);
    setIsPosting(false);
    setPostingProgress(0);
    setPostingIndex(null);
    setShowRetryWithUnique(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setShowRetryWithUnique(false);
    setIndividualTweets([]);
    setEditingIndex(null);
    setEditValue("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
      });

      const data = await res.json();

      if (res.ok) {
        const parsedTweets = parseThread(data.thread);
        setIndividualTweets(parsedTweets);
        // Optional: Add toast notification for success
      } else {
        setError(data.error || "something went wrong");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  // Close download menu when clicking outside (for dropdown version)
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (showDownloadMenu) {
        setShowDownloadMenu(false);
      }
    };

    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  // const tweets = parseThread(thread);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Advanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0f172a] to-[#1e293b]"></div>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-purple-500/15 animate-pulse"></div>
      
      {/* Floating Radial Gradient Spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-400/30 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-400/25 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-radial from-purple-400/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
      
      {/* Moving Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Content Container */}
      <div className="relative z-10 p-8">
        {/* User Welcome Section */}
        <UserWelcome />
        
        {/* Dashboard Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Thread <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Generator</span>
            </h1>
            <p className="text-gray-400 text-lg">Transform your ideas into engaging Twitter threads with AI</p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 shadow-glow-cyan mb-8 hover:shadow-glow-cyan">
            
            {/* Topic Input */}
            <div className="mb-6">
              <label htmlFor="topic" className="block mb-3 text-lg font-semibold text-white">
                What do you want to write a thread about?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How to grow on Twitter, AI trends, productivity tips..."
                className="w-full p-4 rounded-2xl bg-black/60 backdrop-blur-sm text-white border border-cyan-400/30 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-gray-400 outline-none hover:border-cyan-400/40"
              />
            </div>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="block mb-3 text-lg font-semibold text-white">Choose Your Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-4 rounded-2xl bg-black/60 backdrop-blur-sm text-white border border-cyan-400/30 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none hover:border-cyan-400/40"
              >
                <option value="professional" className="bg-black">Professional</option>
                <option value="witty" className="bg-black">Witty</option>
                <option value="storytelling" className="bg-black">Storytelling</option>
                <option value="motivational" className="bg-black">Motivational</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-cyan hover:shadow-glow-cyan hover:scale-[1.02] hover:-translate-y-1"
            >
              ✨ {loading ? "Generating Amazing Content..." : "Generate Thread"}
            </button>
          </div>
        </div>

        {/* Display error */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900/40 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 shadow-xl shadow-red-500/10">
              <p className="text-red-200 flex items-center gap-3 text-lg mb-4">
                <span className="text-2xl">❌</span>
                <span className="font-medium">{error}</span>
              </p>
              
              {/* Show retry button for duplicate content */}
              {showRetryWithUnique && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRetryWithUniqueContent}
                    disabled={isPosting}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPosting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        🎯 Try with Unique Content
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowRetryWithUnique(false)}
                    disabled={isPosting}
                    className="text-gray-300 hover:text-white transition-colors px-4 py-3 border border-gray-600 hover:border-gray-500 rounded-xl bg-black/40 hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display success */}
        {successMessage && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-green-900/40 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 shadow-xl shadow-green-500/10">
              <p className="text-green-200 flex items-center gap-3 text-lg">
                <span className="text-2xl">✅</span>
                <span className="font-medium">{successMessage}</span>
              </p>
            </div>
          </div>
        )}

       {/* Display generated thread as Twitter-like cards */}
        {individualTweets.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Header with multiple copy options */}
            <div className="glass-card rounded-3xl p-6 mb-6 shadow-glow-cyan">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Generated Thread</h2>
                  <div className="text-gray-400 text-sm flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                      <span className="font-medium">{individualTweets.length} tweets</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      <span className="font-medium">{individualTweets.reduce((total, tweet) => total + tweet.length, 0)} characters</span>
                    </span>
                  </div>
                </div>
                {/* Modern Action Buttons */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-2xl p-3 border border-gray-600/60 shadow-lg shadow-black/20 relative z-50">
                    {/* Download Button */}
                    <div className="relative z-50">
                      <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        disabled={individualTweets.length === 0}
                        className="group relative flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800/40 border border-gray-600/40 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105"
                        title="Download thread"
                      >
                        <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs text-gray-300 group-hover:text-cyan-300 mt-1 font-medium">Download</span>
                      </button>
                      
                      {/* Download Dropdown */}
                      {showDownloadMenu && (
                        <>
                          {/* Backdrop to close dropdown */}
                          <div 
                            className="fixed inset-0 z-[9998]" 
                            onClick={() => setShowDownloadMenu(false)}
                          />
                          <div className="absolute top-full left-0 mt-2 w-28 bg-black/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl shadow-cyan-400/10 z-[9999]">
                          <button
                            onClick={() => {
                              handleDownload('txt');
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-cyan-400/10 transition-colors rounded-t-xl flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <span className="font-medium text-xs">TXT</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDownload('csv');
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-cyan-400/10 transition-colors rounded-b-xl flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <span className="font-medium text-xs">CSV</span>
                          </button>
                        </div>
                        </>
                      )}
                    </div>

                    {/* Publish/Post Button */}
                    <button
                      onClick={handlePostToTwitter}
                      disabled={individualTweets.length === 0}
                      className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800/40 border border-gray-600/40 hover:border-blue-400/60 hover:bg-blue-400/10 hover:shadow-lg hover:shadow-blue-400/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105"
                      title={session?.accessToken ? "Post to X/Twitter" : "Connect to X/Twitter"}
                    >
                      <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-xs text-gray-300 group-hover:text-blue-300 mt-1 font-medium">Publish</span>
                    </button>

                    {/* Share Link Button */}
                    <button
                      onClick={copyForTwitter}
                      className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800/40 border border-gray-600/40 hover:border-purple-400/60 hover:bg-purple-400/10 hover:shadow-lg hover:shadow-purple-400/20 transition-all duration-300 transform hover:scale-105"
                      title="Copy thread for Twitter"
                    >
                      <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-xs text-gray-300 group-hover:text-purple-300 mt-1 font-medium">Share</span>
                    </button>

                    {/* Copy Thread Button (More) */}
                    <button
                      onClick={copyEntireThread}
                      className="group flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800/40 border border-gray-600/40 hover:border-emerald-400/60 hover:bg-emerald-400/10 hover:shadow-lg hover:shadow-emerald-400/20 transition-all duration-300 transform hover:scale-105"
                      title="Copy entire thread with numbering"
                    >
                      <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-300 group-hover:text-emerald-300 mt-1 font-medium">Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tweet Cards Container */}
            <div className="max-w-3xl mx-auto space-y-4 glass-scrollbar">
              {individualTweets.map((tweet, index) => (
                <TweetCard
                  key={index}
                  content={tweet}
                  index={index}
                  total={individualTweets.length}
                  isEditing={editingIndex === index}
                  editValue={editValue}
                  onEditStart={() => handleEditStart(index)}
                  onEditSave={() => handleEditSave(index)}
                  onEditCancel={handleEditCancel}
                  onEditChange={handleEditChange}
                  userName={session?.user?.name || "You"}
                  userHandle={
                    session?.user?.username 
                      ? `@${session.user.username}` 
                      : twitterUsername 
                        ? `@${twitterUsername}`
                        : "@username"
                  }
                />
              ))}
            </div>

            {/* Additional Actions */}
            <div className="mt-8 text-center">
              <div className="glass-card rounded-2xl p-6 inline-block">
                <p className="text-gray-300 text-sm flex items-center gap-3">
                  <span className="text-xl animate-pulse">💡</span>
                  <span className="font-medium">Tip: Individual tweets can be copied using the 📋 button on each card</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Post to Twitter Modal */}
        {showPostToTwitter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={!isPosting ? handleCancelPosting : undefined}
            />
            
            {/* Modal */}
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {session?.accessToken ? 'Post to X (Twitter)' : 'Connect to X (Twitter)'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {session?.accessToken 
                        ? (session?.user?.username 
                            ? `Connected as @${session.user.username}` 
                            : twitterUsername
                              ? `Connected as @${twitterUsername}`
                              : session?.user?.name 
                                ? `Connected as ${session.user.name}` 
                                : 'Share your thread with the world')
                        : 'Connect your X account to post threads'
                      }
                    </p>
                  </div>
                </div>
                {!isPosting && (
                  <button
                    onClick={handleCancelPosting}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto glass-scrollbar">
                {/* Progress Bar (when posting) */}
                {isPosting && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Posting Progress</span>
                      <span className="text-sm text-gray-400">{Math.round(postingProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${postingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {postingIndex !== null ? `Posting tweet ${postingIndex + 1} of ${individualTweets.length}...` : 'Preparing...'}
                    </p>
                  </div>
                )}

                {/* Thread Preview (only if connected) */}
                {session?.accessToken && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Thread Preview</h3>
                    {individualTweets.map((tweet, index) => (
                      <div 
                        key={index}
                        className={`glass-card rounded-2xl p-4 transition-all duration-300 ${
                          postingIndex === index 
                            ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                            : postingIndex !== null && index < postingIndex 
                              ? 'ring-2 ring-green-500 bg-green-500/10' 
                              : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {postingIndex !== null && index < postingIndex ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : postingIndex === index ? (
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-200 leading-relaxed">{tweet}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {tweet.length}/280 characters
                              </span>
                              <button
                                onClick={() => handlePostSingleTweet(index)}
                                disabled={isPosting || !session?.accessToken}
                                className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Post Individual
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-6 bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 text-blue-400 flex-shrink-0">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Twitter Integration</h4>
                      <p className="text-blue-200 text-sm">
                        {session?.accessToken 
                          ? "Your thread will be posted as a series of connected tweets. The first tweet will appear without numbering, while subsequent tweets will be numbered."
                          : "Connect your X account to enable posting. Your credentials are kept secure and only used for posting threads."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-cyan-400/20 bg-black/50">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={handleCancelPosting}
                    disabled={isPosting}
                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors border border-gray-600 hover:border-gray-500 rounded-xl bg-black/40 hover:bg-black/60 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPosting ? 'Posting...' : 'Cancel'}
                  </button>
                  
                  {session?.accessToken ? (
                    <button
                      onClick={handlePostEntireThread}
                      disabled={isPosting || individualTweets.length === 0}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPosting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Posting Thread...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                          Post Entire Thread ({individualTweets.length} tweets)
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectTwitter}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Connect X Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}