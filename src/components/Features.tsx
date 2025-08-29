import React from 'react'
import { HoverEffect } from './ui/card-hover-effect'

const Features = () => {
  const features = [
    {
      title: "AI-powered Generation",
      description: "Generate high-quality Twitter threads instantly with advanced AI that understands your audience, tone, and engagement patterns.",
      icon: "🧠"
    },
    {
      title: "Smart Tone Control", 
      description: "Choose from professional, witty, or storytelling styles to match your brand voice and connect authentically with your audience.",
      icon: "💬"
    },
    {
      title: "Direct Publishing",
      description: "Preview, edit, and post directly to Twitter with seamless integration, real-time editing, and scheduling capabilities.",
      icon: "𝕏"
    }
  ]

  return (
    <section className="relative py-20 px-6">
      {/* Section Background with slight variation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>
      
      {/* Subtle accent elements */}
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-radial from-cyan-400/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-gradient-radial from-blue-400/8 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Everything you need to <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">level up</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to help you create engaging Twitter content that resonates with your audience and drives real engagement.
          </p>
        </div>
        
        <HoverEffect items={features} />
      </div>
    </section>
  )
}

export default Features