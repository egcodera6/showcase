import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../types';
import { Section, InfoSection, OverviewImageSection } from '../types/sections';
import { 
  RocketLaunch, Favorite, ChatBubble, Send, ArrowForward, Person,
  DeployedCode, Analytics, ClinicalNotes, Check, GridView, Share, MoreHoriz, Mail, Language, ViewQuilt
} from './Icons';
import SectionRenderer from './sections/SectionRenderer';

interface ProjectData {
  id: string;
  title: string;
  type: 'cover' | 'browser-mockup' | 'project-details' | 'call-to-action';
  data: any;
  sections?: Section[];
}

interface DynamicSlideProps extends SlideProps {
  project: ProjectData;
}

const sectionTypeLabels: Record<Section['type'], string> = {
  grid: 'Grid',
  'overview-image': 'Overview',
  info: 'Info',
  features: 'Features',
  stats: 'Stats',
};

const getProjectTags = (data: any): string[] => {
  const tags = [
    ...(Array.isArray(data?.tags) ? data.tags : []),
    ...(Array.isArray(data?.metadata?.tags) ? data.metadata.tags : []),
  ].filter(Boolean);

  return Array.from(new Set(tags));
};

const mapFeatureItems = (features: any): Array<{ icon: string; title: string; description: string }> => {
  if (!Array.isArray(features)) return [];

  return features
    .map((feature, index) => {
      if (typeof feature === 'string') {
        return {
          icon: 'check',
          title: feature,
          description: 'Feature highlight',
        };
      }

      return {
        icon: feature?.icon || 'check',
        title: feature?.title || `Feature ${index + 1}`,
        description: feature?.description || '',
      };
    })
    .filter((feature) => feature.title || feature.description);
};

const getStatsItems = (stats: any): Array<{ label: string; value: string }> => {
  if (!stats) return [];

  if (Array.isArray(stats)) {
    return stats
      .map((stat) => ({
        label: stat?.label || 'Metric',
        value: String(stat?.value || ''),
      }))
      .filter((stat) => stat.value);
  }

  return Object.entries(stats).map(([label, value]) => ({
    label,
    value: String(value),
  }));
};

const getProjectSections = (project: ProjectData): Section[] => {
  const explicitSections = Array.isArray(project.sections)
    ? project.sections
    : Array.isArray(project.data?.sections)
      ? project.data.sections
      : [];

  const data = project.data || {};
  const techStack = Array.isArray(data.techStack) ? data.techStack : [];

  // If we have explicit sections, we STILL might want to merge global data into them
  // specifically for 'info' and 'overview-image' sections if they are empty
  if (explicitSections.length > 0) {
    return explicitSections.map((section: Section) => {
      if (section.type === 'info') {
        return {
          ...section,
          problem: section.problem || data.problem,
          solution: section.solution || data.solution,
          techStack: (section.techStack && section.techStack.length > 0) ? section.techStack : techStack,
          description: section.description || data.description,
          title: section.title || data.headerTitle || data.projectName || project.title
        } as InfoSection;
      }
      if (section.type === 'overview-image' && !section.imageUrl) {
        return {
          ...section,
          imageUrl: data.mainContent?.image || data.images?.main || section.imageUrl,
          title: section.title || data.headerTitle || data.projectName || project.title,
          description: section.description || data.description
        } as OverviewImageSection;
      }
      return section;
    });
  }

  const sections: Section[] = [];
  
  if (data.headerTitle || data.description || data.problem || data.solution || techStack.length > 0) {
    sections.push({
      id: `${project.id}-generated-info`,
      type: 'info',
      title: data.headerTitle || `${data.projectName || project.title} overview`,
      description: data.description || 'Project summary',
      problem: data.problem,
      solution: data.solution,
      techStack,
    });
  }

  const featureItems = mapFeatureItems(data.features);
  const primaryImage = data.mainContent?.image || data.images?.main;
  const secondaryImage = data.sideContent?.image || data.images?.secondary;
  const gridItems: Array<{
    id: string;
    type: 'image' | 'card' | 'feature-card';
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: string;
  }> = [];

  if (primaryImage) {
    gridItems.push({
      id: `${project.id}-generated-grid-image`,
      type: 'image',
      imageUrl: primaryImage,
      title: data.mainContent?.title || 'Primary visual',
    });
  }

  if (data.sideContent?.title || data.sideContent?.description || data.mainContent?.title || data.mainContent?.description) {
    gridItems.push({
      id: `${project.id}-generated-grid-card`,
      type: 'card',
      title: data.sideContent?.title || data.mainContent?.title || 'Project detail',
      subtitle: data.sideContent?.type || data.mainContent?.subtitle || 'Interface',
      description: data.sideContent?.description || data.mainContent?.description || data.description,
    });
  }

  if (featureItems[0]) {
    gridItems.push({
      id: `${project.id}-generated-grid-feature`,
      type: 'feature-card',
      title: featureItems[0].title,
      description: featureItems[0].description,
      icon: featureItems[0].icon,
    });
  }

  if (secondaryImage && gridItems.length < 4) {
    gridItems.push({
      id: `${project.id}-generated-grid-secondary-image`,
      type: 'image',
      imageUrl: secondaryImage,
      title: data.sideContent?.title || 'Secondary visual',
    });
  }

  if (gridItems.length > 0) {
    sections.push({
      id: `${project.id}-generated-grid`,
      type: 'grid',
      layout: '2x2',
      items: gridItems,
    });
  }

  const overviewImage = secondaryImage || primaryImage;
  if (overviewImage) {
    sections.push({
      id: `${project.id}-generated-overview`,
      type: 'overview-image',
      imageUrl: overviewImage,
      title: data.projectName || project.title,
      description: data.sideContent?.description || data.mainContent?.description || data.description,
    });
  }

  const remainingFeatures = gridItems.some((item) => item.type === 'feature-card')
    ? featureItems.slice(1)
    : featureItems;

  if (remainingFeatures.length > 0) {
    sections.push({
      id: `${project.id}-generated-features`,
      type: 'features',
      features: remainingFeatures,
    });
  }

  const stats = getStatsItems(data.stats);
  if (stats.length > 0) {
    sections.push({
      id: `${project.id}-generated-stats`,
      type: 'stats',
      stats,
    });
  }

  return sections;
};

const DynamicSlideRenderer: React.FC<DynamicSlideProps> = ({ project, onNext, onPrevious }) => {
  const renderCoverSlide = () => (
    <div className="relative w-full max-w-[600px] aspect-square bg-background-dark overflow-hidden rounded-xl shadow-2xl border border-primary/10 mx-auto">
      {/* Abstract Geometric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #590df2 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col p-12">
        {/* Top Navigation / Logo */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg text-slate-100">
              <RocketLaunch className="text-2xl" />
            </div>
            <h2 className="text-slate-100 text-xl font-bold tracking-tight">TechAgency</h2>
          </div>
          <div className="text-slate-400 text-sm font-medium tracking-widest uppercase">
            Portfolio 2024
          </div>
        </header>

        {/* Main Central Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-10 shadow-2xl flex flex-col items-center text-center">
            <div className="mb-6 flex gap-2">
              <span className="h-1.5 w-12 bg-primary rounded-full"></span>
              <span className="h-1.5 w-4 bg-primary/30 rounded-full"></span>
              <span className="h-1.5 w-4 bg-primary/30 rounded-full"></span>
            </div>
            <h1 className="text-slate-100 text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Website <br />
              <span className="text-primary">Showcase</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xs">
              Recent Web Projects
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Person className="text-sm text-slate-400" />
                  </div>
                ))}
              </div>
              <span className="text-slate-300 text-sm font-semibold">+12 Client Successes</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="flex justify-between items-end">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-3 text-primary border border-primary/20">
                <Favorite className="text-xl" />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Like</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-3 text-primary border border-primary/20">
                <ChatBubble className="text-xl" />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Comment</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-primary/20 p-3 text-primary border border-primary/20">
                <Send className="text-xl" />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Share</p>
            </div>
          </div>
          <motion.button
            onClick={onNext}
            className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-slate-100 text-xs font-bold">Swipe to Explore</span>
            <ArrowForward className="text-primary text-sm" />
          </motion.button>
        </footer>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2 opacity-50">
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
        <div className="w-1 h-8 bg-primary/30 rounded-full"></div>
        <div className="w-1 h-1 bg-primary rounded-full"></div>
      </div>
    </div>
  );

  const renderBrowserMockup = () => {
    const { data } = project;
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background-light dark:bg-background-dark">
        <div className="relative w-full max-w-[1080px] aspect-square bg-background-dark overflow-hidden border border-slate-800 rounded-xl flex flex-col">
          {/* Tech Agency Navigation/Header */}
          <header className="flex items-center justify-between px-12 py-8 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <DeployedCode className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">TechStudio</span>
            </div>
            <div className="flex gap-4">
              <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Project {data.status}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-12 flex flex-col">
            {/* Project Identity */}
            <div className="mb-10">
              <h1 className="text-6xl font-extrabold tracking-tighter mb-2">{data.projectName}</h1>
              <p className="text-primary text-xl font-medium">{data.subtitle}</p>
            </div>

            {/* Main Browser Mockup Container */}
            <div className="relative flex-1 mb-12">
              {/* Browser Mockup */}
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 browser-shadow flex flex-col">
                {/* Browser Header */}
                <div className="h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="mx-auto bg-slate-700/50 rounded px-10 py-1 text-[10px] text-slate-400 font-mono">
                    {data.url}
                  </div>
                </div>

                {/* Browser Content */}
                <div className="flex-1 relative bg-[#161022]">
                  {(data.browserContent?.backgroundImage || data.images?.main) && (
                    <>
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_#590df2_0%,_transparent_70%)]"></div>
                      <img 
                        className="w-full h-full object-cover mix-blend-overlay" 
                        alt={`${data.projectName} interface`}
                        src={data.browserContent?.backgroundImage || data.images?.main}
                      />
                    </>
                  )}

                  {/* Render overlay elements */}
                  {data.browserContent?.overlayElements?.map((element: any, index: number) => (
                    <div key={index} className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="glass-card p-6 rounded-xl max-w-md">
                        <div className="flex items-center gap-3 mb-2">
                          <Analytics className="text-primary" />
                          <span className="font-bold">{element.label}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${element.value}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-400 uppercase font-bold">
                          <span>{element.description}</span>
                          <span>{element.value}{element.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Render floating cards */}
                  {data.browserContent?.floatingCards?.map((card: any, index: number) => (
                    <motion.div
                      key={index}
                      className={`absolute ${card.position === 'right' ? '-right-6 top-20' : '-left-6 bottom-20'} glass-card p-5 rounded-xl border-primary/30 ${card.position === 'right' ? 'w-64' : 'w-56'}`}
                      initial={{ opacity: 0, x: card.position === 'right' ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.2 }}
                    >
                      {card.title && (
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {card.icon === 'clinical_notes' && <ClinicalNotes className="text-primary" />}
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">{card.title}</p>
                            <p className="text-sm font-bold">{card.subtitle}</p>
                          </div>
                        </div>
                      )}
                      {card.type === 'user-avatars' ? (
                        <div className="flex justify-center -space-x-2">
                          {card.content.map((avatar: string, i: number) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-background-dark ${avatar.startsWith('+') ? 'bg-slate-700' : avatar === 'SK' ? 'bg-primary text-white' : 'bg-slate-800'} flex items-center justify-center text-[10px] font-bold`}>
                              {avatar}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {[...Array(card.content[1])].map((_, i) => (
                            <div key={i} className={`h-1 ${i === 0 ? 'w-full' : 'w-3/4'} bg-slate-700 rounded-full`}></div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Details */}
            <div className="grid grid-cols-2 gap-12 pb-12">
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed text-lg">
                  {data.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {data.features?.map((feature: string, index: number) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Check className="text-sm text-primary group-hover:text-white" />
                    </div>
                    <span className="text-slate-100 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-10 rounded-full"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 rounded-full"></div>
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => {
    const { data } = project;
    const sections = getProjectSections(project);
    const projectName = data.projectName || project.title;
    const headerTitle = data.headerTitle || `${projectName} Details`;
    const description =
      data.description || 'A section-driven details slide for combining screenshots, context, and proof points.';
    const platform = data.platform || data.metadata?.platform || 'Custom digital product';
    const status = data.status || data.metadata?.status || 'Prototype';
    const tags = getProjectTags(data);
    const sectionSummary = sections.reduce<Record<string, number>>((summary, section) => {
      summary[section.type] = (summary[section.type] || 0) + 1;
      return summary;
    }, {});

    return (
      <div className="relative  overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_42%,#ffffff_100%)] shadow-2xl dark:border-slate-800 dark:bg-[linear-gradient(145deg,#020617_0%,#111827_42%,#0f172a_100%)]">
        <div className="absolute left-[-120px] top-[-140px] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[90px]" />
        <div className="absolute bottom-[-140px] right-[-100px] h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[90px] dark:bg-primary/15" />

        <header className="relative z-10 flex items-center justify-between border-b border-slate-200/80 px-10 py-8 dark:border-slate-800/90">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ViewQuilt className="text-3xl" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Project Details</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{projectName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
              {status}
            </span>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-900">
              <Share className="w-4 h-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-900">
              <MoreHoriz className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="relative z-10 flex-1 min-h-0 px-10 pb-10">
          <div className="grid h-full grid-cols-[400px_minmax(0,1fr)] overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65">
            <div className="flex min-h-0 flex-col border-r border-slate-200/80 p-8 dark:border-slate-800/90">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Case study
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-slate-100 dark:text-slate-900">
                  {sections.length} section{sections.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">{projectName}</p>
                <h1 className="mt-4 text-5xl font-black leading-[0.94] tracking-[-0.05em] text-slate-950 dark:text-slate-50">
                  {headerTitle}
                </h1>
                <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Platform</p>
                  <p className="mt-3 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{platform}</p>
                </div>
                <div className="rounded-[22px] border border-primary/15 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Layout</p>
                  <p className="mt-3 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Section-driven</p>
                </div>
              </div>

              {tags.length > 0 && (
                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-[24px] bg-slate-950 p-5 text-white dark:bg-slate-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">Layout Summary</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(sectionSummary).map(([type, count]) => (
                    <span
                      key={type}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
                    >
                      {count} {sectionTypeLabels[type as Section['type']]}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  The details slide now renders reusable sections first, so new projects no longer depend on a hardcoded content schema.
                </p>
              </div>

              <div className="mt-auto flex items-start gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GridView className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Better authoring flow</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Arrange sections in the editor to change the slide structure instantly, with starter content that renders visibly.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col p-6">
              <div className="flex items-end justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/90">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Live Layout</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Reusable sections</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  Order follows editor
                </span>
              </div>

              <div className="mt-5 flex-1 min-h-0 overflow-y-auto pr-2">
                {sections.length > 0 ? (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <SectionRenderer section={section} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="max-w-sm">
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No sections yet</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        Add grid, info, overview, features, or stats sections in the editor to build this slide.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCallToAction = () => (
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

  // Render based on project type
  switch (project.type) {
    case 'cover':
      return renderCoverSlide();
    case 'browser-mockup':
      return renderBrowserMockup();
    case 'project-details':
      return renderProjectDetails();
    case 'call-to-action':
      return renderCallToAction();
    default:
      return <div>Unknown project type: {project.type}</div>;
  }
};

export default DynamicSlideRenderer;
