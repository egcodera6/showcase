import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { ViewQuilt, Share, MoreHoriz, Analytics, Memory } from '../Icons';

const PhysiosimDetailsSlide: React.FC<SlideProps> = () => {
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-light dark:bg-background-dark overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl mx-auto rounded-xl">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-[4%] py-[3%] shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <ViewQuilt className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Physiosim Project</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center rounded-lg h-8 w-8 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            <Share className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center rounded-lg h-8 w-8 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            <MoreHoriz className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-[4%] flex flex-col gap-4 min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-2 shrink-0">
          <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-black">Physiosim Details</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            A deep dive into the next-gen physiotherapy simulation platform. Bridging clinical expertise with immersive technology.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Main Screenshot */}
          <motion.div 
            className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="aspect-video w-full bg-cover bg-center shrink-0" 
              style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC-HSSFcLiqmAd8gdCM0zqQAnuQb6G2VnwIV-W6DN7zvKqyoz4eZRHz8dx969yLPLjQBalPjFATzv7o1JOTvfLoQyOddq-rD9OQHM7N78fCG_b01KMSpjW5NyAgLzn3O51184k7s0aarGcpPhsQON9ZTPcNJmCgTKLKDTNak3XqI7UXdUl8wQQC8wcBD9GNpqZ3-02dV_Sixwb6rqt_vyKVs7RmkNMNOKIKNnKmdNHythB6_LU6p95kf5RsEGH-CRzrGpYys5AtUzU)' }}
            />
            <div className="p-4 flex-1">
              <h4 className="text-primary text-[10px] font-bold uppercase mb-1">Interface</h4>
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Homepage Overview</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">Intuitive dashboard designed for practitioner workflow.</p>
            </div>
          </motion.div>

          {/* Side Content */}
          <div className="grid grid-rows-2 gap-4 min-h-0">
            {/* UI Highlight */}
            <motion.div 
              className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div 
                className="h-24 w-full bg-cover bg-center shrink-0" 
                style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuB2RLPIC6uplD97PcFiAerLYxPbOXyK2Xmc8S0C0BsTGMtbPad2BCIQFn-E3TJ74wj8d_r80H_y6DwfqAkpw5BiZprDMiaZQzo-mvodLylJxU5oO0d95_oudlO4MlucZum922mbcUKwVoqNsNVeCl_FllFqMwVQ_KCQuTrkFeZEkIiBvrjgCff_HBZlgWz_25dOk3FyFU0FJqvkvdAdCv8QeMbY-DTjyo-6nKY4M93L6Qh91eS6wQRLzltArVd6kTrnJty-foviPOg)' }}
              />
              <div className="p-3 flex-1">
                <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold">UI System Highlight</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">Custom component library built for accessibility.</p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-primary/10 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Analytics className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-slate-900 dark:text-slate-100 text-xs font-bold">Real-time Tracking</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">Motion sensors Integration.</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-primary/10 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Memory className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-slate-900 dark:text-slate-100 text-xs font-bold">AI Diagnostics</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">Automated assessment.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div 
          className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Platform</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Web / VR / Mobile</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Status</span>
              <span className="text-xs font-semibold text-primary">Live Beta</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-medium">Design</span>
            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-medium">Healthcare</span>
            <span className="px-2 py-1 bg-primary text-white rounded-full text-[10px] font-bold">v2.0</span>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 shrink-0">
        <motion.div className="h-full bg-primary w-3/5" initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ delay: 0.5 }} />
      </div>
    </div>
  );
};

export default PhysiosimDetailsSlide;
