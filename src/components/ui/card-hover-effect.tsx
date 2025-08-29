"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link?: string;
    icon?: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={`${item.title}-${idx}`}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm block rounded-3xl border border-cyan-400/20"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            {item.icon && <CardIcon>{item.icon}</CardIcon>}
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl h-full w-full p-8 overflow-hidden bg-black/50 backdrop-blur-lg border border-cyan-400/20 group-hover:border-cyan-400/40 relative z-20 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-400/15",
        className
      )}
    >
      <div className="relative z-50">
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
};
export const CardIcon = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/30 shadow-2xl shadow-cyan-400/25 group-hover:shadow-cyan-400/40 group-hover:scale-110 transition-all duration-500",
        className
      )}
    >
      <span className="text-white text-3xl">{children}</span>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-white font-bold tracking-wide text-xl mb-4 group-hover:text-cyan-300 transition-colors duration-300",
        className
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-gray-300 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
