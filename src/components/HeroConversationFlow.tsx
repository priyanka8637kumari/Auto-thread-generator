"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Play, MoreHorizontal, MessageCircle, Repeat2, Heart } from "lucide-react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { people } from "@/data/people";

interface HeroConversationFlowProps {
  headline?: string;
  subtext?: string;
  messages?: string[];
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  className?: string;
}

const defaultMessages = [
  "🚀 Just discovered the secret to 10x productivity as a developer...",
  "It's not about working longer hours or using more tools.",
  "It's about understanding the 80/20 rule and applying it to your workflow.",
  "Here's how I went from burning out to building better products in less time: 🧵"
];

const HeroConversationFlow: React.FC<HeroConversationFlowProps> = ({
  headline = "Your ideas. Our AI. Viral threads in seconds.",
  subtext = "Transform your thoughts into engaging Twitter threads that captivate and convert.",
  messages = defaultMessages,
  onPrimaryClick,
  onSecondaryClick,
  primaryButtonText = "Generate my first thread",
  secondaryButtonText = "Watch 30s demo",
  className = "",
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showMeta, setShowMeta] = useState<boolean[]>(new Array(messages.length).fill(false));
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Typewriter effect
  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) {
      // Show all content immediately if reduced motion is preferred
      setCurrentLineIndex(messages.length - 1);
      setCurrentCharIndex(messages[messages.length - 1]?.length || 0);
      setShowMeta(new Array(messages.length).fill(true));
      return;
    }

    cleanup();

    if (currentLineIndex < messages.length) {
      const currentMessage = messages[currentLineIndex];
      
      if (currentCharIndex < currentMessage.length) {
        intervalRef.current = setTimeout(() => {
          setCurrentCharIndex(currentCharIndex + 1);
        }, 50); // Typing speed
      } else {
        // Line complete, show meta and move to next line
        setShowMeta(prev => {
          const newMeta = [...prev];
          newMeta[currentLineIndex] = true;
          return newMeta;
        });
        
        timeoutRef.current = setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentCharIndex(0);
        }, 800); // Pause between lines
      }
    }

    return cleanup;
  }, [currentLineIndex, currentCharIndex, isPlaying, messages, shouldReduceMotion]);

  const resetAnimation = () => {
    cleanup();
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setShowMeta(new Array(messages.length).fill(false));
    setIsPlaying(true);
  };

  // Small avatar placeholders
  const avatarUsers = [
    { initials: "SC", color: "from-cyan-400 to-blue-500" },
    { initials: "MR", color: "from-purple-400 to-pink-500" },
    { initials: "ET", color: "from-green-400 to-emerald-500" },
    { initials: "JD", color: "from-orange-400 to-red-500" },
  ];

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      aria-live="polite"
    >
      {/* Subtle dotted grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Floating gradient spots */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-64 lg:w-80 h-56 sm:h-64 lg:h-80 bg-gradient-radial from-blue-400/15 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Copy & CTAs */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <header className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {headline}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                {subtext}
              </p>
            </header>

            <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start" role="navigation" aria-label="Primary actions">
              <motion.button
                onClick={onPrimaryClick}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 sm:px-6 py-3 rounded-2xl font-semibold text-base sm:text-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Generate your first Twitter thread"
              >
                {primaryButtonText}
              </motion.button>
              
              <motion.button
                onClick={onSecondaryClick}
                className="text-gray-300 px-4 sm:px-6 py-3 rounded-2xl font-medium text-base sm:text-lg hover:text-white transition-all duration-300 border border-gray-600 hover:border-cyan-400/50 bg-black/40 backdrop-blur-sm hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Watch a 30 second demo"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  {secondaryButtonText}
                </span>
              </motion.button>
            </nav>

            {/* Trust line with avatars */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 p-4 sm:p-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <AnimatedTooltip items={people}/>
              </div>
              
              <p className="text-gray-400 text-sm font-medium text-center sm:text-left">
                Trusted by 10,000+ creators
              </p>
            </div>
          </div>

          {/* Right Column - Animated Twitter Thread Mock */}
          <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="w-full max-w-sm sm:max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-black/60 backdrop-blur-xl rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                      <img src="/logo.webp" alt="AutoThread Logo" className="w-12 h-12 rounded-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">AutoThread AI</span>
                        <span className="bg-cyan-400/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          Following
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">@autothread_ai</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                {/* Thread Body */}
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.map((message, lineIndex) => (
                    <div key={lineIndex} className="space-y-2">
                      <div className="text-gray-100 leading-relaxed text-sm sm:text-base">
                        {lineIndex <= currentLineIndex && (
                          <span>
                            {lineIndex === currentLineIndex 
                              ? message.slice(0, currentCharIndex)
                              : message
                            }
                            {lineIndex === currentLineIndex && currentCharIndex < message.length && (
                              <span className="animate-pulse">|</span>
                            )}
                          </span>
                        )}
                      </div>
                      
                      {/* Meta actions - show when line is complete */}
                      <AnimatePresence>
                        {showMeta[lineIndex] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
                              <MessageCircle className="w-4 h-4" />
                              <span>{Math.floor(Math.random() * 20) + 5}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer">
                              <Repeat2 className="w-4 h-4" />
                              <span>{Math.floor(Math.random() * 50) + 10}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                              <Heart className="w-4 h-4" />
                              <span>{Math.floor(Math.random() * 100) + 25}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Replay Button */}
                <div className="p-3 sm:p-4 border-t border-gray-700/50">
                  <motion.button
                    onClick={resetAnimation}
                    className="w-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 py-2 px-4 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm border border-cyan-400/30 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Replay thread animation"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Replay
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroConversationFlow;

// TODO: Hook primary CTA to auth flow
// TODO: Replace placeholder avatars with real user images  
// TODO: Swap copy for localized strings

/* 
Demo Usage:

import HeroConversationFlow from './HeroConversationFlow';

const customMessages = [
  "🎯 The biggest mistake developers make when building SaaS...",
  "They focus on features instead of solving real problems.",
  "I learned this the hard way after 3 failed launches.",
  "Here's the framework that finally worked: 🧵"
];

export default function HomePage() {
  return (
    <HeroConversationFlow
      headline="Build better. Ship faster. Grow smarter."
      subtext="Turn your development insights into viral content that builds your personal brand."
      messages={customMessages}
      onPrimaryClick={() => console.log('Primary CTA clicked')}
      onSecondaryClick={() => console.log('Secondary CTA clicked')}
    />
  );
}
*/
