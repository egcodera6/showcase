import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { RocketLaunch, Favorite, ChatBubble, Send, ArrowForward, Person } from '../Icons';

const CoverSlide: React.FC<SlideProps> = ({ onNext }) => {
  return (
    <div className="relative w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[800px] max-h-[800px] bg-background-dark overflow-hidden rounded-xl shadow-2xl border border-primary/10 mx-auto">
      {/* Abstract Geometric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[80px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[60px]"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #590df2 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col p-[6%]">
        {/* Top Navigation / Logo */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg text-slate-100">
              <RocketLaunch className="w-5 h-5" />
            </div>
            <h2 className="text-slate-100 text-lg font-bold tracking-tight">TechAgency</h2>
          </div>
          <div className="text-slate-400 text-xs font-medium tracking-widest uppercase">
            Portfolio 2024
          </div>
        </header>

        {/* Main Central Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="mb-4 flex gap-2">
              <span className="h-1.5 w-10 bg-primary rounded-full"></span>
              <span className="h-1.5 w-3 bg-primary/30 rounded-full"></span>
              <span className="h-1.5 w-3 bg-primary/30 rounded-full"></span>
            </div>
            <h1 className="text-slate-100 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">
              Website <br />
              <span className="text-primary">Showcase</span>
            </h1>
            <p className="text-slate-400 text-base font-medium max-w-xs">
              Recent Web Projects
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Person className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
              <span className="text-slate-300 text-xs font-semibold">+12 Client Successes</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="flex justify-between items-end">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-2 text-primary border border-primary/20">
                <Favorite className="w-4 h-4" />
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter">Like</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-2 text-primary border border-primary/20">
                <ChatBubble className="w-4 h-4" />
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter">Comment</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-2 text-primary border border-primary/20">
                <Send className="w-4 h-4" />
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter">Share</p>
            </div>
          </div>
          <motion.button
            onClick={onNext}
            className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-2 rounded-full hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-slate-100 text-xs font-bold">Swipe to Explore</span>
            <ArrowForward className="w-4 h-4 text-primary" />
          </motion.button>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-1.5 opacity-50">
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-6 bg-primary/30 rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default CoverSlide;
