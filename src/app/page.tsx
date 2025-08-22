import LoginButton from "@/components/LoginButton";
import { Navbar } from "@/components/NavBar";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Spotlight } from "@/components/ui/Spotlight";
import { Sparkles } from "lucide-react";
import { people } from "@/data/people";

export default function Home() {
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
      <div className="relative z-10">
        <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="#0891b2"
      />
      {/* Navigation */}
      <nav className="w-full p-6 relative z-20 mb-16">
        <div className="flex justify-center">
          <Navbar />
        </div>
      </nav>
      

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-4xl mb-16 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-cyan-400/40 mb-8 shadow-lg shadow-cyan-400/20">
            <span className="text-cyan-400 font-semibold text-sm">AutoThread</span>
            <span className="text-gray-500">•</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">AI-powered thread generation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Generate better threads.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            AI-written, tailored for Twitter. Create engaging threads that captivate your audience and grow your following.
          </p>
          
          <LoginButton />
          <div className="mt-12 text-sm text-gray-400">
            Trusted by 10,000+ creators and developers
          </div>
          <div className="flex flex-row items-center justify-center mt-6 mb-10 w-full">
            <AnimatedTooltip items={people} />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-powered</h3>
            <p className="text-gray-300">Generate high-quality Twitter threads, instantly.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tone control</h3>
            <p className="text-gray-300">Choose from professional, witty, or storytelling styles.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
              <span className="text-white text-2xl">🐦</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Direct posting</h3>
            <p className="text-gray-300">Preview, edit, and post directly to Twitter.</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 text-center max-w-2xl">
          <blockquote className="text-xl md:text-2xl text-gray-200 font-medium mb-4">
            "Built for students, creators, and indie devs who want to level up their Twitter game."
          </blockquote>
          <cite className="text-gray-400">Priyanka</cite>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm py-8 px-6 border-t border-cyan-400/20">
        <div className="max-w-4xl mx-auto flex justify-between">
          <div>
            <h4 className="font-bold text-white mb-2">Resources</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Support</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
      </div> {/* Close content container */}
    </main>
  );
}
