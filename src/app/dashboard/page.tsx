"use client";

import TweetCard from "@/components/TweetCard";
import UserWelcome from "@/components/UserWelcome";
import { useState } from "react";

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [thread, setThread] = useState("");
  const [individualTweets, setIndividualTweets] = useState<string[]>([]); // Individual tweets array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Index of tweet being edited
  const [editValue, setEditValue] = useState<string>(""); // Value for editing tweet

  // Function to parse raw thread text into individual tweets
  const parseThread = (rawThread: string): string[] => {
    if (!rawThread) return [];
    
    return rawThread
      .split('\n') // Split by line breaks
      .filter(line => line.trim() !== '') // Remove empty lines
      .map(tweet => {
        // Remove numbering patterns like "1/", "1.", "1)", "Thread 1:", etc.
        return tweet
          .replace(/^\d+[\/\.\)\:]\s*/, '') // Remove "1/" "1." "1)" "1:"
          .replace(/^Thread\s+\d+\s*[:\-]\s*/i, '') // Remove "Thread 1:" or "Thread 1-"
          .replace(/^\*\*\d+[\/\.\)]\*\*\s*/, '') // Remove "**1/**" markdown
          .trim();
      })
      .filter(tweet => tweet.length > 0) // Remove empty tweets after cleaning
      .filter(tweet => !tweet.match(/^thread\s*$/i)); // Remove standalone "thread" lines
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

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setThread("");
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
        setThread(data.thread);
        const parsedTweets = parseThread(data.thread);
        setIndividualTweets(parsedTweets);
        // Optional: Add toast notification for success
      } else {
        setError(data.error || "something went wrong");
      }
    } catch (error) {
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  // const tweets = parseThread(thread);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* User Welcome Section */}
      <UserWelcome />
      
      <h1 className="text-3xl font-bold mb-4">Auto Thread Generator</h1>

      <label htmlFor="topic" className="block mb-2 text-lg font-medium">
        What do you want to write a thread about?
      </label>

      <input
        type="text"
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. How to grow on Twitter"
        className="w-full p-3 rounded-md text-black bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />

      <label className="block mb-2 text-lg mt-4">Tone</label>
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full p-3 rounded-md text-black bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all mb-4"
      >
        <option value="professional">Professional</option>
        <option value="witty">Witty</option>
        <option value="storytelling">Storytelling</option>
        <option value="motivational">Motivational</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="mt-4 bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
      >
        ✨ {loading ? "Generating..." : "Generate Thread"}
      </button>

      {/* Display error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded">
          <p className="text-red-200">❌ {error}</p>
        </div>
      )}

     {/* Display generated thread as Twitter-like cards */}
      {individualTweets.length > 0 && (
        <div className="mt-8">
          {/* Header with multiple copy options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">Generated Thread</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyEntireThread}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm font-medium"
              >
                📋 Copy Thread
              </button>
              <button
                onClick={copyForTwitter}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm font-medium"
              >
                🐦 Copy for Twitter
              </button>
            </div>
          </div>

          {/* Thread Stats */}
          <div className="mb-6 text-gray-400 text-sm">
            <span>{individualTweets.length} tweets • </span>
            <span>{individualTweets.reduce((total, tweet) => total + tweet.length, 0)} total characters</span>
          </div>

          {/* Tweet Cards Container */}
          <div className="max-w-2xl mx-auto sm:mx-0">
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
              />
            ))}
          </div>

          {/* Additional Actions */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-4">
              💡 Tip: Individual tweets can be copied using the 📋 button on each card
            </p>
          </div>
        </div>
      )}

    </main>
  );
}