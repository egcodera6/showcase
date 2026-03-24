import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../types';
import { Section, InfoSection, OverviewImageSection, ProjectData } from '../types/sections';
import { 
  RocketLaunch, Favorite, ChatBubble, Send, ArrowForward, Person,
  DeployedCode, Analytics, ClinicalNotes, Check, GridView, Share, MoreHoriz, Mail, Language, ViewQuilt
} from './Icons';
import { renderSections } from './sections/SectionRenderer';

// Using imported ProjectData type

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
  const data = project.data || {};
  const sections = getProjectSections(project);

  const renderCoverSlide = () => (
    <div className="flex h-screen w-full flex-col items-center gap-12 overflow-y-auto bg-background-light p-12 dark:bg-background-dark">
      <div className="relative aspect-square w-full max-w-[600px] shrink-0 overflow-hidden rounded-xl border border-primary/10 bg-background-dark shadow-2xl">
        {/* Abstract Geometric Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
          <div className="absolute bottom-[-5%] right-[-5%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #590df2 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full flex-col p-12">
          {/* Top Navigation / Logo */}
          <header className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2 text-slate-100">
                <RocketLaunch className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-100">TechAgency</h2>
            </div>
            <div className="text-sm font-medium uppercase tracking-widest text-slate-400">Portfolio 2024</div>
          </header>

          {/* Main Central Card */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex w-full flex-col items-center rounded-xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex gap-2">
                <span className="h-1.5 w-12 rounded-full bg-primary"></span>
                <span className="h-1.5 w-4 rounded-full bg-primary/30"></span>
                <span className="h-1.5 w-4 rounded-full bg-primary/30"></span>
              </div>
              <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-slate-100">
                Website <br />
                <span className="text-primary">Showcase</span>
              </h1>
              <p className="text-lg font-medium text-slate-400">Recent Web Projects</p>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-background-dark bg-slate-800"
                    >
                      <Person className="text-sm text-slate-400" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-300">+12 Client Successes</span>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="flex items-end justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-full border border-primary/20 bg-primary/20 p-3 text-primary">
                  <Favorite className="text-xl" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Like</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-full border border-primary/20 bg-primary/20 p-3 text-primary">
                  <ChatBubble className="text-xl" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Comment</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-full border border-primary/20 bg-primary/20 p-3 text-primary">
                  <Send className="text-xl" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Share</p>
              </div>
            </div>
            <motion.button
              onClick={onNext}
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 transition-colors hover:bg-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs font-bold text-slate-100">Swipe to Explore</span>
              <ArrowForward className="text-sm text-primary" />
            </motion.button>
          </footer>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2 opacity-50">
          <div className="h-1 w-1 rounded-full bg-primary"></div>
          <div className="h-1 w-1 rounded-full bg-primary"></div>
          <div className="h-1 w-1 rounded-full bg-primary"></div>
          <div className="h-8 w-1 rounded-full bg-primary/30"></div>
          <div className="h-1 w-1 rounded-full bg-primary"></div>
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className="w-full max-w-[900px]">{renderSections(sections)}</div>
    </div>
  );

  const renderBrowserMockup = () => (
    <div className="flex w-full flex-col items-center gap-12 bg-background-light py-12 dark:bg-background-dark">
      <div className="relative flex min-h-[900px] w-full max-w-[1080px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-background-dark">
        {/* Tech Agency Navigation/Header */}
        <header className="z-10 flex items-center justify-between px-12 py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <DeployedCode className="text-white" />
            </div>
            <span className="text-xl font-bold uppercase tracking-tight">TechStudio</span>
          </div>
          <div className="flex gap-4">
            <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Project {data.status}</span>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col px-12">
          {/* Project Identity */}
          <div className="mb-10">
            <h1 className="mb-2 text-6xl font-extrabold tracking-tighter">{data.projectName}</h1>
            <p className="text-xl font-medium text-primary">{data.subtitle}</p>
          </div>

          {/* Main Browser Mockup Container */}
          <div className="relative mb-12 flex-1">
            {/* Browser Mockup */}
            <div className="browser-shadow flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              {/* Browser Header */}
              <div className="flex h-10 items-center gap-2 border-b border-slate-700 bg-slate-800 px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="mx-auto rounded bg-slate-700/50 px-10 py-1 font-mono text-[10px] text-slate-400">{data.url}</div>
              </div>

              {/* Browser Content */}
              <div className="relative flex-1 bg-[#161022]">
                {(data.browserContent?.backgroundImage || data.images?.main) && (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#590df2_0%,_transparent_70%)] opacity-40"></div>
                    <img className="h-full w-full object-cover mix-blend-overlay" alt={`${data.projectName} interface`} src={data.browserContent?.backgroundImage || data.images?.main} />
                  </>
                )}

                {/* Render overlay elements */}
                {data.browserContent?.overlayElements?.map((element: any, index: number) => (
                  <div key={index} className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="glass-card max-w-md rounded-xl p-6">
                      <div className="mb-2 flex items-center gap-3">
                        <Analytics className="text-primary" />
                        <span className="font-bold">{element.label}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-primary" style={{ width: `${element.value}%` }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase text-slate-400">
                        <span>{element.description}</span>
                        <span>
                          {element.value}
                          {element.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Render floating cards */}
                {data.browserContent?.floatingCards?.map((card: any, index: number) => (
                  <motion.div
                    key={index}
                    className={`absolute ${card.position === 'right' ? '-right-6 top-20' : '-left-6 bottom-20'} glass-card border-primary/30 rounded-xl p-5 ${card.position === 'right' ? 'w-64' : 'w-56'}`}
                    initial={{ opacity: 0, x: card.position === 'right' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                  >
                    {card.title && (
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">{card.icon === 'clinical_notes' && <ClinicalNotes className="text-primary" />}</div>
                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">{card.title}</p>
                          <p className="text-sm font-bold">{card.subtitle}</p>
                        </div>
                      </div>
                    )}
                    {card.type === 'user-avatars' ? (
                      <div className="flex justify-center -space-x-2">
                        {card.content.map((avatar: string, i: number) => (
                          <div
                            key={i}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background-dark text-[10px] font-bold ${avatar.startsWith('+') ? 'bg-slate-700' : avatar === 'SK' ? 'bg-primary text-white' : 'bg-slate-800'}`}
                          >
                            {avatar}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[...Array(card.content[1])].map((_, i) => (
                          <div key={i} className={`h-1 rounded-full bg-slate-700 ${i === 0 ? 'w-full' : 'w-3/4'}`}></div>
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
              <p className="text-lg leading-relaxed text-slate-400">{data.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {data.features?.map((feature: string, index: number) => (
                <motion.div key={index} className="group flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + index * 0.1 }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary">
                    <Check className="text-sm text-primary group-hover:text-white" />
                  </div>
                  <span className="font-medium text-slate-100">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute left-0 top-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px]"></div>
      </div>

      {/* Dynamic Sections */}
      <div className="w-full max-w-[900px]">{renderSections(sections)}</div>
    </div>
  );

  const renderProjectDetails = () => {
    const projectName = data.projectName || project.title;
    const headerTitle = data.headerTitle || `${projectName} Details`;
    const description = data.description || 'A section-driven details slide for combining screenshots, context, and proof points.';
    const platform = data.platform || data.metadata?.platform || 'Custom digital product';
    const status = data.status || data.metadata?.status || 'Prototype';
    const tags = getProjectTags(data);
    const sectionSummary = sections.reduce<Record<string, number>>((summary, section) => {
      summary[section.type] = (summary[section.type] || 0) + 1;
      return summary;
    }, {});

    return (
      <div className="dark:bg-[linear-gradient(145deg,#020617_0%,#111827_42%,#0f172a_100%)] relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_42%,#ffffff_100%)] shadow-2xl dark:border-slate-800">
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
              <Share className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-900">
              <MoreHoriz className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="relative z-10 flex-1 min-h-0 px-10 pb-10">
          <div className="grid h-full grid-cols-[400px_minmax(0,1fr)] overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/65">
            <div className="flex min-h-0 flex-col border-r border-slate-200/80 p-8 dark:border-slate-800/90">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Case study</span>
                <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-slate-100 dark:text-slate-900">
                  {sections.length} section{sections.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary/80">{projectName}</p>
                <h1 className="mt-4 text-5xl font-black leading-[0.94] tracking-[-0.05em] text-slate-950 dark:text-slate-50">{headerTitle}</h1>
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
                      <span key={index} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
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
                    <span key={type} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100">
                      {count} {sectionTypeLabels[type as Section['type']]}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">The details slide now renders reusable sections first, so new projects no longer depend on a hardcoded content schema.</p>
              </div>

              <div className="mt-auto flex items-start gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GridView className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Better authoring flow</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Arrange sections in the editor to change the slide structure instantly, with starter content that renders visibly.</p>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col p-6">
              <div className="flex h-11 items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/90">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Live Layout</p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Reusable sections</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">Order follows editor</span>
              </div>

              <div className="mt-5 flex-1 pr-2">
                {renderSections(sections) || (
                  <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="max-w-sm">
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No sections yet</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Add grid, info, overview, features, or stats sections in the editor to build this slide.</p>
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
    <div className="flex w-full flex-col items-center gap-12 bg-background-light py-12 dark:bg-background-dark">
      <div className="relative flex aspect-square w-full max-w-[1080px] shrink-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-slate-200 bg-background-light p-20 dark:border-slate-800 dark:bg-background-dark">
        {/* Abstract Background Elements */}
        <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary opacity-40 blur-[80px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] h-[400px] w-[400px] rounded-full bg-primary/40 opacity-40 blur-[80px]"></div>

        {/* Top Section: Logo & Branding */}
        <div className="relative z-10 flex w-full justify-center">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary p-3 text-white">
              <RocketLaunch className="text-4xl" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">TechAgency</h2>
          </div>
        </div>

        {/* Middle Section: Main CTA */}
        <div className="relative z-10 flex w-full flex-col items-center text-center gap-12">
          <motion.div className="glass-panel max-w-3xl rounded-xl p-16" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="mb-8 text-7xl font-extrabold leading-[1.1] tracking-tight">
              Need a website <br />
              <span className="text-primary">like this?</span>
            </h1>
            <p className="mx-auto mb-12 max-w-xl text-2xl text-slate-600 dark:text-slate-400">Let's build your future with custom high-performance web solutions for tech-forward brands.</p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <motion.button className="rounded-xl bg-primary px-12 py-6 text-2xl font-bold text-white shadow-lg shadow-primary/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started
              </motion.button>
              <motion.button className="glass-panel rounded-xl px-12 py-6 text-2xl font-bold text-slate-900 transition-colors hover:bg-white/10 dark:text-slate-100" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                View Portfolio
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Contact Details */}
        <motion.div className="relative z-10 w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <div className="glass-panel flex items-center justify-between rounded-xl px-10 py-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Email us</span>
              <div className="flex items-center gap-2">
                <Mail className="text-slate-500" />
                <p className="text-xl font-medium">hello@techagency.design</p>
              </div>
            </div>
            <div className="h-12 w-[1px] bg-slate-700/50"></div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Official Website</span>
              <div className="flex items-center justify-end gap-2">
                <p className="text-xl font-medium">www.techagency.design</p>
                <Language className="text-slate-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute left-20 top-1/2 -translate-y-1/2 opacity-20">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-slate-500"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className="w-full max-w-[900px]">{renderSections(sections)}</div>
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
    case 'cta':
      return renderCallToAction();
    default:
      return <div>Unknown project type: {project.type}</div>;
  }
};

export default DynamicSlideRenderer;
