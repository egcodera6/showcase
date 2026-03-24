export type SectionType = 'grid' | 'overview-image' | 'info' | 'features' | 'stats' | 'cta';

export interface BaseSection {
  id: string;
  type: SectionType;
}

export interface GridSection extends BaseSection {
  type: 'grid';
  layout: '2x2' | '1-2' | '2-1' | '1-1-1';
  items: GridItem[];
}

export interface GridItem {
  id: string;
  type: 'image' | 'card' | 'feature-card' | 'featured-card';
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  span?: '1' | '2';
}

export interface OverviewImageSection extends BaseSection {
  type: 'overview-image';
  imageUrl: string;
  title?: string;
  description?: string;
  overlay?: {
    label: string;
    value: number;
    unit: string;
    description: string;
  };
}

export interface InfoSection extends BaseSection {
  type: 'info';
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  techStack?: string[];
}

export interface FeaturesSection extends BaseSection {
  type: 'features';
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface StatsSection extends BaseSection {
  type: 'stats';
  stats: {
    label: string;
    value: string;
  }[];
}

export type ButtonType = 'primary' | 'secondary';
export type LinkType = 'internal' | 'external' | 'email';

export interface CTAButton {
  id: string;
  text: string;
  link: string;
  type: ButtonType;
  linkType: LinkType;
}

export interface CTASection extends BaseSection {
  type: 'cta';
  title: string;
  description: string;
  buttons: CTAButton[];
}

export type Section =
  | GridSection
  | OverviewImageSection
  | InfoSection
  | FeaturesSection
  | StatsSection
  | CTASection;

export interface ProjectData {
  id: string;
  title: string;
  type: 'cover' | 'browser-mockup' | 'project-details' | 'cta';
  data: any;
  sections?: Section[];
}
