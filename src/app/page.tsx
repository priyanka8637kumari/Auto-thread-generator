import { Navbar } from "@/components/NavBar";
import { Spotlight } from "@/components/ui/Spotlight";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";
import Image from "next/image";

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
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      {/* Content Container */}
      <div className="relative z-10">
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="#0891b2"
        />
        
        {/* Navigation */}
       <nav className="w-full pt-6 relative z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 pt-2">
            <Image src="/logo.webp" alt="AutoThread AI" width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
            <span className="text-white font-bold text-xl">AutoThread</span>
          </div>
          <Navbar />
        </div>
      </nav>

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <Features />

        {/* Testimonial */}
        <Testimonial />

        {/* Footer */}
        <Footer />
      </div>{" "}
      {/* Close content container */}
    </main>
  );
}
