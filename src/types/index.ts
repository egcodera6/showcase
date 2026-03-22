export interface Slide {
  id: string;
  title: string;
  component: React.ComponentType<SlideProps>;
}

export interface SlideProps {
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalSlides?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  status: 'live' | 'beta' | 'prototype';
  url?: string;
  features: string[];
}
