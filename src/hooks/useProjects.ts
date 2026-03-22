import { useState, useEffect } from 'react';

export interface ProjectData {
  id: string;
  title: string;
  type: 'cover' | 'browser-mockup' | 'project-details' | 'cta';
  data: {
    projectName?: string;
    headerTitle?: string;
    subtitle?: string;
    description?: string;
    problem?: string;
    solution?: string;
    techStack?: string[];
    features?: string[];
    stats?: Record<string, string>;
    status?: string;
    url?: string;
    platform?: string;
    version?: string;
    tags?: string[];
    images?: Record<string, string>;
    headline?: string;
    subheadline?: string;
    email?: string;
    website?: string;
    buttons?: Array<{ text: string; primary: boolean }>;
  };
}

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { projects, loading, error };
};
