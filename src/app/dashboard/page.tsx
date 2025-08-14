"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");

  const handleGenerate = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }
    // This will be replaced by actual API call to generate thread
    console.log("Generating thread for:", topic, "with tone:", tone);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
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
        className="w-full p-3 rounded-md text-white"
      />

      <label className="block mb-2 text-lg">Tone</label>
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full p-3 rounded-md text-white mb-4"
      >
        <option value="professional">Professional</option>
        <option value="witty">Witty</option>
        <option value="storytelling">Storytelling</option>
        <option value="motivational">Motivational</option>
      </select>

      <button
        onClick={handleGenerate}
        className="mt-4 bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition"
      >
        ✨ Generate Thread
      </button>
    </main>
  );
}
