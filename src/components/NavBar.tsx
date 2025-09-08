"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-6 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      {/* <div className="flex items-center justify-between px-6"> */}
        {/* Logo Section */}
        {/* <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-cyan-400/50 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/30 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-bold text-lg">AutoThread</span>
          </div>
        </div> */}

        {/* Navigation Menu */}
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-3 text-sm p-2">
              <div className="text-gray-300">
                <p className="text-white font-semibold mb-2">Learn More</p>
                <p className="text-gray-400 text-xs max-w-[200px]">
                  Discover how AutoThread can transform your Twitter presence with AI-powered content generation.
                </p>
              </div>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Features">
            <div className="flex flex-col space-y-3 text-sm p-2">
              <div className="text-gray-300">
                <p className="text-white font-semibold mb-2">Powerful Features</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                    <span>AI-powered thread generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                    <span>Multiple tone options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                    <span>Direct Twitter integration</span>
                  </div>
                </div>
              </div>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-3 text-sm p-2">
              <div className="text-gray-300">
                <p className="text-white font-semibold mb-2">Simple Pricing</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-gradient-to-r from-cyan-400/10 to-blue-500/10 p-3 rounded-lg border border-cyan-400/20">
                    <p className="text-cyan-400 font-semibold">Free Tier</p>
                    <p className="text-gray-400">5 threads per month</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400/10 to-purple-500/10 p-3 rounded-lg border border-blue-400/20">
                    <p className="text-blue-400 font-semibold">Pro Plan</p>
                    <p className="text-gray-400">Unlimited threads</p>
                  </div>
                </div>
              </div>
            </div>
          </MenuItem>
        </Menu>
      
    </div>
  );
}
