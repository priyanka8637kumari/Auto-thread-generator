import React from 'react'

const Testimonial = () => {
  return (
    <section className="relative py-16 px-6">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-400/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center">
          {/* Quote container with glass effect */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-black/40 backdrop-blur-lg border border-cyan-400/20 shadow-2xl shadow-cyan-400/10">
            {/* Quote icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/25">
              <span className="text-white text-3xl">&ldquo;</span>
            </div>
            
            {/* Quote text */}
            <blockquote className="text-xl md:text-2xl lg:text-3xl text-white font-medium mb-6 leading-relaxed">
              &ldquo;Built for students, creators, career professionals and indie devs who want to 
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> level up their Twitter game</span>.&rdquo;
            </blockquote>
            
            {/* Author section */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                <span className="text-cyan-400 text-lg font-bold">P</span>
              </div>
              <div className="text-left">
                <cite className="text-gray-300 font-semibold text-lg not-italic">Priyanka</cite>
                <p className="text-gray-400 text-sm">Creator of AutoThread</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial