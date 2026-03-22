import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { GridView, Bolt, Timer, Group, CheckCircle } from '../Icons';

const FocusOverviewSlide: React.FC<SlideProps> = () => {
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-dark overflow-hidden flex flex-col items-center justify-start p-[4%] border border-slate-800 mx-auto rounded-xl relative">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>

      {/* Header Section */}
      <div className="w-full mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-primary flex items-center justify-center rounded-lg">
            <GridView className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Focus</h1>
            <p className="text-primary font-medium mt-1 text-xl">Productivity Web App</p>
          </div>
        </div>
        <p className="max-w-2xl text-slate-400 text-lg leading-relaxed">
          A streamlined interface designed to eliminate distractions and boost deep work efficiency for modern tech teams.
        </p>
      </div>

      {/* Browser Mockup Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden browser-shadow z-10">
        {/* Browser Chrome */}
        <div className="h-10 bg-slate-800/80 border-b border-slate-700 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/80"></div>
            <div className="size-3 rounded-full bg-yellow-500/80"></div>
            <div className="size-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto bg-slate-700/50 rounded-md px-4 py-1 text-[10px] text-slate-400 w-1/2 text-center">
            focus-app.io/dashboard
          </div>
        </div>

        {/* Content within Mockup */}
        <div className="relative flex h-full bg-[#161023] group/design-root">
          <div className="layout-container flex h-full grow flex-col">
            {/* Nav Component */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2f2249] px-6 py-3">
              <div className="flex items-center gap-3 text-white">
                <div className="size-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-white text-md font-bold leading-tight tracking-tight">Focus</h2>
              </div>
              <div className="flex flex-1 justify-end gap-6 items-center">
                <div className="flex items-center gap-6">
                  <span className="text-slate-300 text-xs font-medium">Features</span>
                  <span className="text-slate-300 text-xs font-medium">Pricing</span>
                  <span className="text-slate-300 text-xs font-medium">About</span>
                </div>
                <button className="flex min-w-[70px] cursor-pointer items-center justify-center rounded-lg h-8 px-3 bg-primary text-white text-xs font-bold">
                  Sign Up
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" 
                  style={{ 
                    backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAHh59QwZ-p67S-y-VgwfcBffSlicm9C_Pbd2W1o2IxcczPwRbQ5Coou4RJdho6v04d3u84-eESGOmlElw2-3pQd6YpUYOGXa74ofKZw9Y5_X_JWKqc7QhwpVyJv5YKxZiYLK6-zIau86jMEQHYrVtJWiaHKJH3ZuqV-g4ACFJzNR2WTCqfqKk-DXyN3Ra7125xH6kG7DrjOIbX7USFZZs_d6DL-G-osccApyNVNmAJQ57zhlcbx6rkQAxQaXQFY41jlCSOn8Wx-PM)'
                  }}
                />
              </div>
            </header>

            {/* Main Dashboard Area */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-6 h-[280px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <h3 className="text-white text-xl font-bold mb-2">Daily Deep Work</h3>
                  <div className="flex items-center gap-4 mt-8">
                    <div className="size-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                      <motion.div 
                        className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-2xl font-bold text-white">45:00</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-4 space-y-4">
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4">
                  <div className="text-xs text-primary font-bold mb-2">UPCOMING</div>
                  <div className="text-sm text-white font-medium">Team Sync</div>
                  <div className="text-xs text-slate-400 mt-1">10:30 AM</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4">
                  <div className="text-xs text-primary font-bold mb-2">PRODUCTIVITY</div>
                  <div className="text-sm text-white font-medium">Current: 92%</div>
                  <div className="mt-2 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-primary h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Overlay Cards */}
      <div className="grid grid-cols-3 gap-6 w-full mt-12 z-20">
        {/* Highlight 1 */}
        <motion.div 
          className="glass-card p-6 rounded-xl flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bolt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Task Engine</h4>
            <p className="text-slate-400 text-sm mt-1">AI-powered prioritization to focus on what matters.</p>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <CheckCircle className="text-primary text-sm" />
            <span className="text-xs text-slate-300">Smart Sorting</span>
          </div>
        </motion.div>

        {/* Highlight 2 */}
        <motion.div 
          className="glass-card p-6 rounded-xl flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Timer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Deep Work Timer</h4>
            <p className="text-slate-400 text-sm mt-1">Customizable cycles to sustain cognitive load.</p>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <CheckCircle className="text-primary text-sm" />
            <span className="text-xs text-slate-300">Focus Analytics</span>
          </div>
        </motion.div>

        {/* Highlight 3 */}
        <motion.div 
          className="glass-card p-6 rounded-xl flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Group className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">Team Sync</h4>
            <p className="text-slate-400 text-sm mt-1">Live visibility into team focus states.</p>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <CheckCircle className="text-primary text-sm" />
            <span className="text-xs text-slate-300">Status Automations</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Logo/Tagline */}
      <div className="mt-auto w-full flex justify-between items-end pb-4 border-t border-slate-800 pt-8 z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold tracking-widest text-xs">PROJECT SHOWCASE</span>
          <span className="w-8 h-[1px] bg-slate-800"></span>
          <span className="text-slate-500 font-bold tracking-widest text-xs">SLIDE 04</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-white text-xs font-bold">NEXTERA</span>
          <span className="text-primary text-xs font-bold">AGENCY</span>
        </div>
      </div>
    </div>
  );
};

export default FocusOverviewSlide;
