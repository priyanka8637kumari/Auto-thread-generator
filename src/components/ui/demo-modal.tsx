"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
  title = "AutoThread AI Demo",
  description = "See how AutoThread AI transforms your ideas into viral Twitter threads in just seconds.",
}) => {
  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl mx-auto bg-black/90 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  <p className="text-gray-300 text-sm mt-1">{description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-cyan-400/10 rounded-lg"
                  aria-label="Close demo modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Content */}
              <div className="relative bg-gray-900">
                <div className="aspect-video w-full">
                  {/* Placeholder for demo video */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Demo Video Coming Soon</h3>
                      <p className="text-gray-400 max-w-md">
                        We're creating an amazing demo video to showcase AutoThread AI's capabilities. 
                        In the meantime, try the live demo by signing up!
                      </p>
                    </div>
                  </div>
                  
                  {/* When you have an actual video, uncomment this and remove the placeholder above */}
                  {/* <iframe
                    src={videoUrl}
                    title="AutoThread AI Demo"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  /> */}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gradient-to-r from-cyan-400/5 to-blue-400/5">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    onClick={onClose}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try AutoThread AI Now
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="text-gray-300 px-6 py-3 rounded-xl font-medium hover:text-white transition-colors border border-gray-600 hover:border-cyan-400/50 bg-black/40 hover:bg-cyan-400/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
