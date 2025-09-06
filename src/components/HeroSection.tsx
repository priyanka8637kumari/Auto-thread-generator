'use client';

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react';
import { people } from '@/data/people';
import { AnimatedTooltip } from './ui/animated-tooltip';
import LoginButton from './LoginButton';
import HeroConversationFlow from './HeroConversationFlow';
import DemoModal from './ui/demo-modal';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Custom messages for AutoThread
  const autoThreadMessages = [
    "🚀 Just cracked the code to viral Twitter threads...",
    "It's not about following templates or copying others.",
    "It's about understanding your audience and speaking their language.",
    "Here's how AutoThread AI creates threads that actually convert: 🧵"
  ];

  const handleGetStarted = () => {
    if (session) {
      // User is already authenticated, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not authenticated, trigger sign in
      signIn('twitter');
    }
  };

  const handleWatchDemo = () => {
    setIsDemoOpen(true);
  };

  return (
    <div className="relative">
      {/* Main Hero with Conversation Flow */}
      <HeroConversationFlow
        headline="Your ideas. Our AI. Viral threads in seconds."
        subtext="Transform your thoughts into engaging Twitter threads that captivate and convert."
        messages={autoThreadMessages}
        onPrimaryClick={handleGetStarted}
        onSecondaryClick={handleWatchDemo}
        primaryButtonText={session ? "Go to Dashboard" : "Generate my first thread"}
      />

      {/* Enhanced Social Proof Section */}
      {/* <div className="relative px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mt-16 relative"> */}
            {/* Background Gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 rounded-3xl blur-xl"></div>
            
            <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-3xl border border-cyan-400/20 p-8 shadow-xl shadow-cyan-400/10"> */}
              {/* Headline */}
              {/* <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Trusted by <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">10,000+</span> creators and developers
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
              </div> */}

              {/* Avatar Row */}
              {/* <div className="flex flex-row items-center justify-center mb-8 w-full">
                <AnimatedTooltip items={people} />
              </div> */}

              {/* Testimonial Quotes */}
              {/* <div className="space-y-6">
                <blockquote className="text-center">
                  <p className="text-gray-300 italic text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                    "This tool helped me grow my following by 3x in 2 months."
                  </p>
                  <footer className="mt-4 text-cyan-400/80 text-sm font-medium">
                    — Sarah Chen, Content Creator
                  </footer>
                </blockquote>
                
                <div className="hidden md:block">
                  <div className="flex items-center justify-center space-x-8 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>500+ threads generated daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>98% satisfaction rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span>Featured on Product Hunt</span>
                    </div>
                  </div>
                </div> */}

                {/* Mobile stats - stacked version */}
                {/* <div className="md:hidden space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>500+ threads generated daily</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>98% satisfaction rate</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span>Featured on Product Hunt</span>
                  </div>
                </div>
              </div> */}

              {/* Additional Testimonial Slider */}
              {/* <div className="mt-8 pt-6 border-t border-cyan-400/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-gray-300 italic text-base leading-relaxed">
                      "AutoThread transformed how I create content. The AI suggestions are spot-on!"
                    </p>
                    <div className="mt-3 text-cyan-400/80 text-sm font-medium">
                      — Marcus Rodriguez, Developer
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-gray-300 italic text-base leading-relaxed">
                      "Finally, a tool that understands my brand voice. My engagement has doubled."
                    </p>
                    <div className="mt-3 text-cyan-400/80 text-sm font-medium">
                      — Emma Thompson, Startup Founder
                    </div>
                  </div>
                </div>
              </div> */}
            {/* </div>
          </div>
        </div>
      </div> */}

      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  )
}

export default HeroSection