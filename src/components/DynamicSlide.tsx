import React from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../hooks/useProjects';
import CoverSlide from './slides/CoverSlide';
import SectionRenderer from './sections/SectionRenderer';
import { Section } from '../types/sections';
import { RocketLaunch, Mail, Language } from './Icons';

interface DynamicSlideProps {
  project: ProjectData;
  onNext?: () => void;
}

const DynamicSlide: React.FC<DynamicSlideProps> = ({ project, onNext }) => {
  // Render based on project type
  switch (project.type) {
    case 'cover':
      return <CoverSlide onNext={onNext} />;
    case 'browser-mockup':
      return renderGenericBrowserMockup(project);
    case 'project-details':
      return renderGenericProjectDetails(project);
    case 'cta':
      return renderCTA(project);
    default:
      return (
        <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-light dark:bg-background-dark overflow-hidden flex flex-col items-center justify-center p-[4%] border border-slate-200 dark:border-slate-800 mx-auto rounded-xl">
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Unknown Project Type</h2>
          <p className="text-slate-600 dark:text-slate-400">{project.type}</p>
          <p className="text-slate-400 dark:text-slate-400 mt-2">Please check your projects.json configuration.</p>
        </div>
      );
  }
};

const renderGenericBrowserMockup = (project: ProjectData) => {
  const { data } = project;
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-dark overflow-hidden border border-slate-800 rounded-xl flex flex-col mx-auto">
      <header className="flex items-center justify-between px-[4%] py-[3%]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <RocketLaunch className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-bold uppercase">{data.projectName}</span>
        </div>
        <div className="glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-[10px] font-semibold uppercase text-slate-400">{data.status}</span>
        </div>
      </header>

      <main className="flex-1 px-[4%] flex flex-col min-h-0">
        <div className="mb-[2%]">
          <h1 className="text-3xl font-extrabold mb-1">{data.projectName}</h1>
          <p className="text-primary text-sm">{data.subtitle}</p>
        </div>

        <div className="text-xs text-slate-400 mb-[2%]">
          <p className="mb-2"><strong>Problem:</strong> {data.problem}</p>
          <p><strong>Solution:</strong> {data.solution}</p>
        </div>

        {/* Tech Stack */}
        <div className="mb-[2%]">
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {data.techStack?.map((tech, i) => (
              <span key={i} className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">{tech}</span>
            ))}
          </div>
        </div>

        {/* Browser Mockup */}
        <div className="flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 mb-[2%]">
          <div className="h-8 bg-slate-800 flex items-center px-3 gap-2 border-b border-slate-700">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
            <div className="mx-auto bg-slate-700/50 rounded px-4 py-0.5 text-[9px] text-slate-400">{data.url}</div>
          </div>
          <div className="flex-1 relative bg-[#161022] p-4">
            {data.images?.main && (
              <img src={data.images.main} alt={data.projectName} className="w-full h-full object-cover rounded" />
            )}
          </div>
        </div>

        {/* Features & Stats */}
        <div className="grid grid-cols-2 gap-4 pb-[2%]">
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Key Features</p>
            <ul className="space-y-1">
              {data.features?.map((feature, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Stats</p>
            <div className="grid grid-cols-2 gap-2">
              {data.stats && Object.entries(data.stats).map(([key, value], i) => (
                <div key={i} className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-slate-400 capitalize">{key}</p>
                  <p className="text-sm font-bold text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const renderGenericProjectDetails = (project: ProjectData) => {
  const { data } = project;
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[900px] max-h-[900px] bg-background-light dark:bg-background-dark overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl mx-auto rounded-xl">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-[4%] py-[3%]">
        <h2 className="text-lg font-bold">{data.projectName} Details</h2>
      </header>

      <div className="flex-1 p-[4%] flex flex-col gap-4 overflow-hidden">
        <div>
          <h1 className="text-2xl font-black mb-2">{data.headerTitle}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{data.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Problem</p>
            <p className="text-slate-300">{data.problem}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Solution</p>
            <p className="text-slate-300">{data.solution}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {data.techStack?.map((tech, i) => (
              <span key={i} className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">{tech}</span>
            ))}
          </div>
        </div>

        {data.images && (
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {data.images.main && (
              <img src={data.images.main} alt="Main" className="w-full h-full object-cover rounded-xl" />
            )}
            {data.images.secondary && (
              <img src={data.images.secondary} alt="Secondary" className="w-full h-full object-cover rounded-xl" />
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-4 text-xs">
            <div><span className="text-slate-500">Platform:</span> {data.platform}</div>
            <div><span className="text-slate-500">Status:</span> <span className="text-primary">{data.status}</span></div>
          </div>
          <div className="flex gap-2">
            {data.tags?.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderCTA = (project: ProjectData) => {
  const { data } = project;
  return (
    <div className="w-[min(85vh,85vw)] h-[min(85vh,85vw)] max-w-[800px] max-h-[800px] bg-background-light dark:bg-background-dark overflow-hidden flex flex-col items-center justify-between p-[5%] border border-slate-200 dark:border-slate-800 mx-auto rounded-xl relative">
      {/* Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary rounded-full opacity-30 blur-[60px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/40 rounded-full opacity-30 blur-[40px]"></div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary text-white">
          <RocketLaunch className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tighter uppercase">TechAgency</h2>
      </div>

      {/* CTA Content */}
      <div className="relative z-10 text-center max-w-md">
        <h1 className="text-4xl font-extrabold leading-tight mb-4">
          {data.headline?.split('like this?')[0]}<br />
          <span className="text-primary">like this?</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{data.subheadline}</p>
        <div className="flex gap-4 justify-center">
          {data.buttons?.map((btn, i) => (
            <button
              key={i}
              className={`px-6 py-3 rounded-xl text-base font-bold ${
                btn.primary
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'glass-panel text-slate-900 dark:text-slate-100'
              }`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="relative z-10 w-full glass-panel px-6 py-4 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="text-sm">{data.email}</span>
        </div>
        <div className="h-8 w-px bg-slate-700/50"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{data.website}</span>
          <Language className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
};

// Helper function to render sections from project data
const renderSections = (sections?: Section[]) => {
  if (!sections || sections.length === 0) return null;
  
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          className="flex-1 min-h-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SectionRenderer section={section} />
        </motion.div>
      ))}
    </div>
  );
};

export default DynamicSlide;
