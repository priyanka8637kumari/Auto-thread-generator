import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="min-h-screen advanced-gradient">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 relative z-10">
        <div className="text-xl font-bold text-white">AutoThread</div>
        <div className="flex space-x-6 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Generate better threads.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            AI-written, tailored for Twitter.
          </p>
          
          <LoginButton />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-powered</h3>
            <p className="text-gray-300">Generate high-quality Twitter threads, instantly.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tone control</h3>
            <p className="text-gray-300">Choose from professional, witty, or storytelling styles.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🐦</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Direct posting</h3>
            <p className="text-gray-300">Preview, edit, and post directly to Twitter.</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 text-center max-w-2xl">
          <blockquote className="text-xl md:text-2xl text-white font-medium mb-4">
            "Built for students, creators, and indie devs who want to level up their Twitter game."
          </blockquote>
          <cite className="text-gray-400">Priyanka</cite>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-gray-800 py-8 px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex justify-between">
          <div>
            <h4 className="font-bold text-white mb-2">Resources</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Support</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
