import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'physiosim',
    name: 'Physiosim',
    description: 'Physiotherapy Simulation Platform',
    technologies: ['React', 'TypeScript', 'Three.js', 'WebGL'],
    status: 'live',
    url: 'https://app.physiosim.io',
    features: [
      'Real-time patient feedback loops',
      'Advanced biomechanical modeling',
      'Interactive clinical case studies',
      'Real-time kinematics tracking',
      'AI diagnostics integration'
    ]
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Productivity Web App',
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
    status: 'beta',
    url: 'https://focus-app.io/dashboard',
    features: [
      'AI-powered task prioritization',
      'Deep work timer with customizable cycles',
      'Team sync and status visibility',
      'Focus analytics and insights',
      'Distraction blocking'
    ]
  }
];
