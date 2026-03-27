import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../types';
import { Section, InfoSection, ProjectData } from '../types/sections';
import { 
  RocketLaunch, Favorite, ChatBubble, ArrowForward,
  DeployedCode, Analytics, ClinicalNotes, Check, GridView, Share, MoreHoriz, Mail, Language, ViewQuilt
} from './Icons';
import { renderSections } from './sections/SectionRenderer';

interface DynamicSlideProps extends SlideProps {
  project: ProjectData;
}

const sectionTypeLabels: Record<Section['type'], string> = {
  grid: 'Grid',
  'overview-image': 'Overview',
  info: 'Info',
  features: 'Features',
  stats: 'Stats',
  cta: 'Call to Action',
};

const getProjectTags = (data: any): string[] => {
  const tags = [
    ...(Array.isArray(data?.tags) ? data.tags : []),
    ...(Array.isArray(data?.metadata?.tags) ? data.metadata.tags : []),
  ].filter(Boolean);

  return Array.from(new Set(tags));
};

const getProjectSections = (project: ProjectData): Section[] => {
  const explicitSections = Array.isArray(project.sections)
    ? project.sections
    : Array.isArray(project.data?.sections)
      ? project.data.sections
      : [];

  const data = project.data || {};
  const techStack = Array.isArray(data.techStack) ? data.techStack : [];

  if (explicitSections.length > 0) {
    return explicitSections.map((section: Section) => {
      if (section.type === 'info') {
        const info = section as InfoSection;
        return {
          ...info,
          problem: info.problem || data.problem,
          solution: info.solution || data.solution,
          techStack: (info.techStack && info.techStack.length > 0) ? info.techStack : techStack,
          description: info.description || data.description,
          title: info.title || data.headerTitle || data.projectName || project.title
        } as InfoSection;
      }
      return section;
    });
  }
  return [];
};

const renderProjectName = (name: string) => {
  if (!name) return null;
  const words = name.split(' ');
  if (words.length === 1) {
    return <span className="text-primary">{words[0]}</span>;
  }
  const lastWord = words.pop();
  return (
    <>
      {words.join(' ')} <br />
      <span className="text-primary">{lastWord}</span>
    </>
  );
};

// --- Shared Shell Component ---
const SharedSlideShell: React.FC<{
  project: ProjectData;
  subtitle: string;
  headerIcon: React.ReactNode;
  sidebarContent: React.ReactNode;
  children: React.ReactNode;
  sections: Section[];
}> = ({ project, subtitle, headerIcon, sidebarContent, children, sections }) => {
  const data = project.data || {};
  const projectName = data.projectName || project.title;
  const status = data.status || data.metadata?.status || 'Prototype';

  return (
    <div className="dark:bg-[linear-gradient(145deg,#020617_0%,#111827_42%,#0f172a_100%)] relative min-h-[calc(100vh-4rem)] h-full w-full rounded-[32px] border border-slate-200 bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_42%,#ffffff_100%)] shadow-2xl dark:border-slate-800 transition-all duration-500 flex flex-col">
      {/* Dynamic Background Elements - Scoped to their own overflow wrapper */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
        <div className="absolute left-[-120px] top-[-140px] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute bottom-[-140px] right-[-100px] h-[360px] w-[360px] rounded-full bg-sky-500/5 blur-[90px] dark:bg-primary/10" />
      </div>

      {/* Standard Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-slate-200/80 px-10 py-8 dark:border-slate-800/90">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {headerIcon}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">{subtitle}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{projectName}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
            {status}
          </span>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-900">
            <Share className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-900">
            <MoreHoriz className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 px-8 pb-8 mt-2 min-h-full">
        {/* We remove overflow-hidden so the sticky sidebar can track vertically. We add rounded borders individually. */}
        <div className="flex min-h-full rounded-[28px] border border-white/70 bg-white/75 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65">
          {/* Left Sidebar */}
          {sidebarContent && (
            <>
              {/* Actual Fixed Sidebar Wrapper */}
              <div className="fixed top-0 bottom-0 left-0 w-[360px] border-r border-slate-200/80 dark:border-slate-800/90 bg-slate-50/10 dark:bg-slate-900/10 backdrop-blur-sm z-40 p-8 pt-[120px] overflow-y-auto custom-scrollbar rounded-l-[28px]">
                 {sidebarContent}
              </div>
              {/* Layout Spacer to maintain flow */}
              <div className="w-[360px] shrink-0 border-r border-slate-200/10 dark:border-slate-800/10" />
            </>
          )}

          {/* Right Main Content + Sections Container */}
          <div className="flex-1 flex flex-col p-8 min-h-full rounded-r-[28px]">
             <div className="flex-1 w-full flex flex-col">
               {children}
             </div>
             
             {/* Unified Section Rendering below children */}
             {sections.length > 0 && (
               <div className="mt-12 w-full pt-12 border-t border-slate-200/50 dark:border-slate-800/50">
                 {renderSections(sections)}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DynamicSlideRenderer: React.FC<DynamicSlideProps> = ({ project, onNext, onPrevious }) => {
  const data = project.data || {};
  const sections = getProjectSections(project);
  const tags = getProjectTags(data);

  const renderCoverSlide = () => {
     const projectName = data.projectName || 'Website Showcase';
     const stats = data.stats || '+12 Client Successes';
     const footerText = data.footerText || 'Swipe to Explore';

     return (
       <SharedSlideShell
         project={project}
         subtitle="Landing Experience"
         headerIcon={<RocketLaunch className="text-3xl" />}
         sections={sections}
         sidebarContent={
           <div className="space-y-8">
             <div className="flex flex-wrap gap-2">
               <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Introduction</span>
             </div>
             <div className="mt-4">
               <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">Welcome</p>
               <h3 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">Project Identity</h3>
               <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">This cover represents the starting point of the presentation, conveying brand identity and core metrics.</p>
             </div>
              <div className="mt-8 rounded-[24px] bg-white p-6 dark:text-white text-slate-900 dark:bg-slate-900 shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/80">Highlights</p>
               <div className="mt-6 flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                   <div className="flex h-12 w-12 items-center justify-center bg-primary/20 rounded-2xl text-primary">
                     <Favorite className="text-2xl" />
                   </div>
                   <div>
                     <p className="text-xl font-bold tracking-tight">{stats}</p>
                     <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Global Engagement</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         }
       >
         <div className="flex w-full flex-col items-center justify-center py-6">
           <div className="relative aspect-square w-full max-w-[500px] shrink-0 overflow-hidden rounded-2xl border border-primary/10 bg-slate-50 dark:bg-background-dark shadow-2xl">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
                <div className="absolute bottom-[-5%] right-[-5%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[100px]"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #590df2 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              </div>
              <div className="relative z-10 flex h-full flex-col p-12">
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex w-full flex-col items-center rounded-xl border border-primary/10 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                    <div className="mb-6 flex gap-2">
                      <span className="h-1.5 w-12 rounded-full bg-primary" />
                      <span className="h-1.5 w-4 rounded-full bg-primary/30" />
                    </div>
                    <h1 className="mb-4 text-5xl font-black leading-tight tracking-tight text-slate-800 dark:text-slate-100">
                      {renderProjectName(projectName)}
                    </h1>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{data.subtitle || 'Recent Web Projects'}</p>
                  </div>
                </div>
                <footer className="flex items-end justify-center">
                  <motion.button
                    onClick={onNext}
                    className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-10 py-5 transition-colors hover:bg-primary/20 dark:bg-primary/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">{footerText}</span>
                    <ArrowForward className="text-xl text-primary" />
                  </motion.button>
                </footer>
              </div>
           </div>
         </div>
       </SharedSlideShell>
     );
  };

  const renderBrowserMockup = () => {
    const projectName = data.projectName || project.title;
    return (
      <SharedSlideShell
        project={project}
        subtitle="Web Product"
        headerIcon={<DeployedCode className="text-3xl text-primary" />}
        sections={sections}
        sidebarContent={
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
               <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Live Experience</span>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">{projectName}</p>
              <h3 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">{data.subtitle}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{data.description}</p>
            </div>
            {data.features && data.features.length > 0 && (
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Core Features</p>
                {data.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Check className="text-xs" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div className="relative w-full max-w-[900px] shrink-0 flex flex-col overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-background-dark shadow-2xl mx-auto mb-4">
            <div className="flex h-10 items-center gap-2 border-b border-slate-300 bg-slate-200 px-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mx-auto rounded bg-slate-300/50 px-10 py-1 font-mono text-[10px] text-slate-600 dark:bg-slate-700/50 dark:text-slate-400">{data.url}</div>
            </div>
            <div className="relative flex-1 aspect-video bg-slate-200 dark:bg-[#161022]">
              {(data.browserContent?.backgroundImage || data.images?.main) && (
                <img className="h-full w-full object-cover" alt={projectName} src={data.browserContent?.backgroundImage || data.images?.main} />
              )}
              {/* Optional: Add a light inner shadow to look more like a browser window */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] pointer-events-none" />
            </div>
        </div>
      </SharedSlideShell>
    );
  };

  const renderProjectDetails = () => {
     const projectName = data.projectName || project.title;
     const headerTitle = data.headerTitle || `${projectName} Details`;
     const sectionSummary = sections.reduce<Record<string, number>>((summary, section) => {
       summary[section.type] = (summary[section.type] || 0) + 1;
       return summary;
     }, {});

     return (
       <SharedSlideShell
         project={project}
         subtitle="Product Logic"
         headerIcon={<ViewQuilt className="text-3xl" />}
         sections={sections}
         sidebarContent={
           <div className="space-y-8">
             <div className="flex flex-wrap gap-2">
               <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Case study</span>
               <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-slate-100 dark:text-slate-900">
                 {sections.length} sections
               </span>
             </div>
             <div>
               <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">{projectName}</p>
               <h3 className="mt-4 text-3xl font-black leading-tight text-slate-900 dark:text-slate-100">{headerTitle}</h3>
               <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">{data.description}</p>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Platform</p>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{data.platform || 'Healthcare'}</p>
               </div>
               <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 dark:border-primary/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Approach</p>
                  <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">Dynamic</p>
               </div>
             </div>
             {tags.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {tags.map((tag, i) => (
                   <span key={i} className="px-3 py-1.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     {tag}
                   </span>
                 ))}
               </div>
             )}
              <div className="mt-4 rounded-3xl bg-white p-6 dark:text-white text-slate-900 dark:bg-slate-900/60 shadow-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/80">Slide Summary</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {Object.entries(sectionSummary).map(([type, count]) => (
                    <span key={type} className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest dark:text-slate-100 text-slate-700">
                     {count} {sectionTypeLabels[type as Section['type']]}
                   </span>
                 ))}
               </div>
             </div>
           </div>
         }
       >
         <div className="flex w-full flex-col gap-8">
            {!sections.length && (
               <div className="flex h-96 items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/30 p-12 text-center dark:border-slate-700 dark:bg-slate-950/20">
                <div className="max-w-sm">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">No content sections</p>
                  <p className="mt-3 text-base leading-relaxed text-slate-500 dark:text-slate-400">This Details slide is currently relying on header data. Add sections in the builder for more depth.</p>
                </div>
              </div>
            )}
         </div>
       </SharedSlideShell>
     );
  };

  const renderCallToAction = () => {
    return (
       <SharedSlideShell
         project={project}
         subtitle="Final Act"
         headerIcon={<ChatBubble className="text-3xl" />}
         sections={sections}
         sidebarContent={
           <div className="flex flex-col h-full space-y-8 justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Call to Action</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">Conclusion</p>
                  <h3 className="mt-4 text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">Ready to collaborate?</h3>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Showcase Projects. All rights reserved.</p>
                <div className="mt-4 flex gap-3">
                  <a href="/contact" className="text-xs font-bold text-primary hover:underline">Contact Us</a>
                  <a href="/about" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">About</a>
                </div>
              </div>
           </div>
         }
       >
         <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-white p-16 dark:border-slate-700 dark:bg-slate-950/80 shadow-xl">
            <h1 className="mb-8 text-5xl font-black text-center tracking-tight leading-tight text-slate-900 dark:text-white">
              {data.headline || "Need a website like this?"}
            </h1>
            <p className="mb-12 text-xl text-slate-600 dark:text-slate-400 text-center max-w-lg mx-auto">{data.subheadline || "Contact us for a discovery session."}</p>
            <div className="flex gap-6">
               <a href="/contact" className="group relative whitespace-nowrap flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-full font-bold text-lg shadow-[0_10px_30px_-10px_rgba(89,13,242,0.5)] hover:scale-105 active:scale-95 transition-all">
                 Get Started
                 <ArrowForward className="group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
         </div>
       </SharedSlideShell>
    );
  };

  switch (project.type) {
    case 'cover': return renderCoverSlide();
    case 'browser-mockup': return renderBrowserMockup();
    case 'project-details': return renderProjectDetails();
    case 'cta': return renderCallToAction();
    default: return null;
  }
};

export default DynamicSlideRenderer;
