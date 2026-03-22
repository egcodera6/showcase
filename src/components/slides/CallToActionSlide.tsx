import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { RocketLaunch, Mail, Language } from '../Icons';

const CallToActionSlide: React.FC<SlideProps> = ({ onNext, onPrevious, currentIndex, totalSlides }) => {
  return (
    <div className="relative w-[1080px] h-[1080px] mx-auto overflow-hidden bg-background-light dark:bg-background-dark flex flex-col items-center justify-between p-20 border border-slate-200 dark:border-slate-800">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary rounded-full opacity-40 blur-[80px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-primary/40 rounded-full opacity-40 blur-[80px]"></div>

      {/* Top Section: Logo & Branding */}
      <div className="relative z-10 w-full flex justify-center">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary text-white">
            <RocketLaunch className="text-4xl" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">TechAgency</h2>
        </div>
      </div>

      {/* Middle Section: Main CTA */}
      <div className="relative z-10 w-full flex flex-col items-center gap-12 text-center">
        <motion.div 
          className="glass-panel p-16 rounded-xl max-w-3xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
            Need a website <br />
            <span className="text-primary">like this?</span>
          </h1>
          <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-12">
            Let's build your future with custom high-performance web solutions for tech-forward brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button 
              className="bg-primary text-white px-12 py-6 rounded-xl text-2xl font-bold shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              className="glass-panel text-slate-900 dark:text-slate-100 px-12 py-6 rounded-xl text-2xl font-bold hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Contact Details */}
      <motion.div 
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="glass-panel px-10 py-8 rounded-xl flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Email us</span>
            <div className="flex items-center gap-2">
              <Mail className="text-slate-500" />
              <p className="text-xl font-medium">hello@techagency.design</p>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-slate-700/50"></div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">Official Website</span>
            <div className="flex items-center gap-2 justify-end">
              <p className="text-xl font-medium">www.techagency.design</p>
              <Language className="text-slate-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-20 -translate-y-1/2 opacity-20">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-slate-500"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallToActionSlide;
