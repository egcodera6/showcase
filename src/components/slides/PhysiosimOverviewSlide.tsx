import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { DeployedCode, Analytics, ClinicalNotes, Check } from '../Icons';

const PhysiosimOverviewSlide: React.FC<SlideProps> = () => {
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-dark overflow-hidden border border-slate-800 rounded-xl flex flex-col mx-auto relative">
      {/* Tech Agency Navigation/Header */}
      <header className="flex items-center justify-between px-[4%] py-[3%] z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <DeployedCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight uppercase">TechStudio</span>
        </div>
        <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Project Live</span>
        </div>
      </header>

      <main className="flex-1 px-[4%] flex flex-col min-h-0">
        {/* Project Identity */}
        <div className="mb-[3%] shrink-0">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-1">Physiosim</h1>
          <p className="text-primary text-sm md:text-base font-medium">Physiotherapy Simulation Platform</p>
        </div>

        {/* Main Browser Mockup Container */}
        <div className="relative flex-1 min-h-0 mb-[3%]">
          {/* Browser Mockup */}
          <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 browser-shadow flex flex-col">
            {/* Browser Header */}
            <div className="h-8 bg-slate-800 flex items-center px-3 gap-2 border-b border-slate-700 shrink-0">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="mx-auto bg-slate-700/50 rounded px-6 py-0.5 text-[9px] text-slate-400 font-mono">
                app.physiosim.io
              </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative bg-[#161022] min-h-0">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_#590df2_0%,_transparent_70%)]"></div>
              <img 
                className="w-full h-full object-cover mix-blend-overlay" 
                alt="Modern physiotherapy clinic"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwiRSWmGcUb_n2Hkf9oQuadmFxhnb7wRn1msRip88jYgo0sxF_NbZSibTqE3qBe0WUmN3uLvMa9VQSpXYAFp51rafdU_vM4aCWULHpNN7Ig8g-DhCM_NsFCEYDhY7d5qiGgaRX5QIexIg8jB790qWkPwjvU_s7TTLCwtKdnAAU9ByFiQgFAtCtojvZuu55urz64Ppgxi2mCHAeoipRbvHHmjWgS3O8DW0rFqcvW-7Co4KkaXJpc2uEI5uIYptjXc2I8SdtoIBr7t4"
              />

              {/* Internal UI Elements */}
              <div className="absolute inset-0 p-[4%] flex flex-col justify-end">
                <div className="glass-card p-4 rounded-xl max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Analytics className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Real-time Kinematics</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%]"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[9px] text-slate-400 uppercase font-bold">
                    <span>Joint Alignment</span>
                    <span>75% Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Glassmorphism Cards */}
          <motion.div 
            className="absolute -right-4 top-12 glass-card p-3 rounded-xl border-primary/30 w-48"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <ClinicalNotes className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Clinical Case</p>
                <p className="text-xs font-bold">Spinal Rehabilitation</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-slate-700 rounded-full"></div>
              <div className="h-1 w-3/4 bg-slate-700 rounded-full"></div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute -left-4 bottom-12 glass-card p-3 rounded-xl border-primary/30 w-40"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 text-center">Active Users</p>
            <div className="flex justify-center -space-x-1.5">
              <div className="w-7 h-7 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center text-[9px] font-bold">JD</div>
              <div className="w-7 h-7 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-[9px] font-bold text-white">SK</div>
              <div className="w-7 h-7 rounded-full border-2 border-background-dark bg-slate-700 flex items-center justify-center text-[9px] font-bold">+12</div>
            </div>
          </motion.div>
        </div>

        {/* Footer Details */}
        <div className="grid grid-cols-2 gap-[3%] pb-[3%] shrink-0">
          <div className="space-y-2">
            <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
              A high-fidelity simulation platform designed for physiotherapy students and professionals to practice clinical reasoning in a risk-free, data-driven environment.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              'Real-time patient feedback loops',
              'Advanced biomechanical modeling',
              'Interactive clinical case studies'
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-3 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                  <Check className="w-3 h-3 text-primary group-hover:text-white" />
                </div>
                <span className="text-slate-100 text-xs font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10 rounded-full"></div>
      <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 blur-[60px] -z-10 rounded-full"></div>
    </div>
  );
};

export default PhysiosimOverviewSlide;
