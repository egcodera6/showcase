import React from 'react';
import { motion } from 'framer-motion';
import {
  Section,
  GridSection,
  OverviewImageSection,
  InfoSection,
  FeaturesSection,
  StatsSection,
} from '../../types/sections';
import {
  Analytics,
  ClinicalNotes,
  CheckCircle,
  Memory,
  Bolt,
  Timer,
  Group,
  GridView,
} from '../Icons';

interface SectionRendererProps {
  section: Section;
}

const sectionShell =
  'rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75';

const iconMap = {
  analytics: Analytics,
  memory: Memory,
  clinical: ClinicalNotes,
  clinical_notes: ClinicalNotes,
  check: CheckCircle,
  bolt: Bolt,
  timer: Timer,
  group: Group,
} as const;

const renderIcon = (icon?: string, className = 'w-5 h-5') => {
  const Icon = icon ? iconMap[icon as keyof typeof iconMap] : undefined;
  const Component = Icon || CheckCircle;
  return <Component className={className} />;
};

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  switch (section.type) {
    case 'grid':
      return <GridSectionComponent section={section} />;
    case 'overview-image':
      return <OverviewImageSectionComponent section={section} />;
    case 'info':
      return <InfoSectionComponent section={section} />;
    case 'features':
      return <FeaturesSectionComponent section={section} />;
    case 'stats':
      return <StatsSectionComponent section={section} />;
    default:
      return <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Unknown section type</div>;
  }
};

const GridSectionComponent: React.FC<{ section: GridSection }> = ({ section }) => {
  const getGridClasses = () => {
    switch (section.layout) {
      case '2x2':
        return 'grid-cols-2';
      case '1-2':
      case '2-1':
      case '1-1-1':
        return 'grid-cols-3';
      default:
        return 'grid-cols-2';
    }
  };

  const getItemSpan = (index: number) => {
    if (section.layout === '1-2' && index === 0) return 'col-span-1';
    if (section.layout === '1-2' && index > 0) return 'col-span-2';
    if (section.layout === '2-1' && index === 0) return 'col-span-2';
    if (section.layout === '2-1' && index > 0) return 'col-span-1';
    return '';
  };

  const layoutLabel =
    section.layout === '2x2'
      ? '2 x 2 grid'
      : section.layout === '1-2'
        ? '1 + 2 columns'
        : section.layout === '2-1'
          ? '2 + 1 columns'
          : '3 equal columns';

  return (
    <div className={`${sectionShell} min-h-[320px] p-4`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Grid Section</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">Visual content layout</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {layoutLabel}
        </span>
      </div>

      <div className={`grid ${getGridClasses()} auto-rows-fr gap-3`}>
        {section.items.map((item, index) => {
          const type = item.type.toLowerCase().replace(/\s/g, '-');
          const isFeatureCard = type === 'feature-card' || type === 'featured-card';
          const isImage = type === 'image';
          const isCard = type === 'card' || type === 'content-card';

          return (
            <motion.div
              key={item.id || index}
              className={`relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 ${getItemSpan(index)} min-h-[150px]`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              {isImage && (
                <>
                  {item.imageUrl ? (
                    <>
                      <img className="h-full w-full object-cover" alt={item.title || 'Grid item'} src={item.imageUrl} />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(15,23,42,0.03))] p-6 text-center dark:bg-[linear-gradient(135deg,rgba(89,13,242,0.18),rgba(15,23,42,0.35))]">
                      <div className="rounded-2xl bg-white/80 p-3 text-slate-500 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">
                        <GridView className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Image slot ready</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Add an image URL to display a screenshot or key visual.</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {isCard && (
                <div className="flex h-full flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                      {item.subtitle || 'Content Card'}
                    </p>
                    <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.title || 'Project Detail'}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description || 'Additional context about this part of the project.'}
                    </p>
                  </div>
                  <div className="mt-6 h-1.5 w-20 rounded-full bg-primary/20" />
                </div>
              )}

              {isFeatureCard && (
                <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(14,165,233,0.03))] p-5 dark:bg-[linear-gradient(135deg,rgba(89,13,242,0.22),rgba(15,23,42,0.18))]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm dark:bg-slate-950/80">
                      {renderIcon(item.icon, 'w-5 h-5')}
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                      Featured
                    </span>
                  </div>
                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.title || 'Add a featured highlight'}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {item.description || 'Use the featured card for standout metrics, differentiators, or product highlights.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const OverviewImageSectionComponent: React.FC<{ section: OverviewImageSection }> = ({ section }) => {
  return (
    <div className={`${sectionShell} min-h-[340px] overflow-hidden`}>
      <div className="flex h-full flex-col">
        <div className="flex h-11 items-center gap-3 border-b border-slate-200 bg-slate-100/90 px-4 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-400/70" />
            <div className="h-3 w-3 rounded-full bg-amber-400/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-full bg-white px-4 py-1 text-center text-[11px] font-medium text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">
            {section.title || 'project-preview'}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_45%),linear-gradient(160deg,#f8fafc_0%,#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(89,13,242,0.34),transparent_45%),linear-gradient(160deg,#111827_0%,#020617_100%)]">
          {section.imageUrl ? (
            <>
              <img className="h-full w-full object-cover object-top" alt={section.title || 'Overview'} src={section.imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="rounded-3xl bg-white/80 p-4 text-slate-500 shadow-lg dark:bg-slate-950/80 dark:text-slate-300">
                <Analytics className="h-10 w-10" />
              </div>
              <div className="max-w-sm">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overview image placeholder</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Add a screenshot to show the product UI, dashboard, or hero experience in context.
                </p>
              </div>
            </div>
          )}

          {(section.description || section.overlay) && (
            <div className="absolute inset-0 flex items-end justify-between gap-4 p-5">
              {section.description ? (
                <div className="max-w-md rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">Overview</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100/90">{section.description}</p>
                </div>
              ) : (
                <div />
              )}

              {section.overlay && (
                <div className="w-full max-w-xs rounded-2xl border border-white/20 bg-slate-950/60 p-4 text-white backdrop-blur">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                      <Analytics className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{section.overlay.label}</p>
                      <p className="text-sm text-slate-200">{section.overlay.description}</p>
                    </div>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${section.overlay.value}%` }} />
                  </div>
                  <p className="mt-3 text-right text-sm font-semibold text-white">
                    {section.overlay.value}
                    {section.overlay.unit}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoSectionComponent: React.FC<{ section: InfoSection }> = ({ section }) => {
  return (
    <div className={`${sectionShell} min-h-[250px] p-5`}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Info Section</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {section.title || 'Project summary'}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {section.description || 'Add a summary to introduce the problem space, context, or strategic outcome.'}
          </p>
        </div>

        {(section.problem || section.solution) && (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Problem</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {section.problem || 'Describe the user, business, or technical challenge this project addresses.'}
              </p>
            </div>
            <div className="rounded-[20px] border border-primary/15 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Solution</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {section.solution || 'Explain the product or design decision that resolves the problem.'}
              </p>
            </div>
          </div>
        )}

        {section.techStack && section.techStack.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tech Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {section.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeaturesSectionComponent: React.FC<{ section: FeaturesSection }> = ({ section }) => {
  return (
    <div className={`${sectionShell} min-h-[230px] p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Key Features</p>
      <div className="mt-4 space-y-3">
        {section.features.length > 0 ? (
          section.features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {renderIcon(feature.icon, 'w-4 h-4')}
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Add feature items to highlight the most important capabilities.
          </div>
        )}
      </div>
    </div>
  );
};

const StatsSectionComponent: React.FC<{ section: StatsSection }> = ({ section }) => {
  return (
    <div className={`${sectionShell} min-h-[220px] p-5`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Stats</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {section.stats.length > 0 ? (
          section.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-[18px] border border-primary/15 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(14,165,233,0.02))] p-4 dark:border-primary/20 dark:bg-[linear-gradient(135deg,rgba(89,13,242,0.18),rgba(15,23,42,0.14))]"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">{stat.value}</p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 rounded-[18px] border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Add one or more stats to surface adoption, performance, or impact.
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionRenderer;
