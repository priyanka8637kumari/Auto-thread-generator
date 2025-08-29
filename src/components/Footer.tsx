import React from 'react'

const Footer = () => {
  return (
    <footer className="relative mt-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>
      
      {/* Content */}
      <div className="relative z-10 bg-black/60 backdrop-blur-lg border-t border-cyan-400/20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/25">
                  <span className="text-white text-lg font-bold">A</span>
                </div>
                <h3 className="text-2xl font-bold text-white">AutoThread</h3>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                AI-powered thread generation for creators, developers, and students who want to level up their Twitter presence.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-black/40 hover:bg-cyan-400/20 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
                  <span className="text-gray-400 hover:text-cyan-400 transition-colors">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black/40 hover:bg-cyan-400/20 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
                  <span className="text-gray-400 hover:text-cyan-400 transition-colors">📧</span>
                </a>
                <a href="#" className="w-10 h-10 bg-black/40 hover:bg-cyan-400/20 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
                  <span className="text-gray-400 hover:text-cyan-400 transition-colors">🐙</span>
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">GitHub</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Changelog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-cyan-400/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 AutoThread. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>for creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer