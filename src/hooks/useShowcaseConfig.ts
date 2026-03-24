import { useState, useEffect } from 'react';

import { Section, ProjectData } from '../types/sections';

// Using imported ProjectData type

interface ShowcaseConfig {
  projects: ProjectData[];
}

export const useShowcaseConfig = () => {
  const [config, setConfig] = useState<ShowcaseConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      
      // First check localStorage for saved projects
      const savedConfig = localStorage.getItem('showcase-config');
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setConfig(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing saved config:', e);
        }
      }
      
      // Fallback: load from JSON file
      const response = await fetch('/projects.json');
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }
      const data = await response.json();
      const configData = { projects: data.projects || [] };
      setConfig(configData);
      
      // Save to localStorage for next time
      localStorage.setItem('showcase-config', JSON.stringify(configData));
    } catch (err) {
      console.error('Error loading showcase config:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: ShowcaseConfig) => {
    try {
      // In a real implementation, this would save to a backend API
      // For now, we'll just update the local state and localStorage
      setConfig(newConfig);
      localStorage.setItem('showcase-config', JSON.stringify(newConfig));
      
      // Also update the public JSON file (this would require a backend in production)
      const blob = new Blob([JSON.stringify(newConfig, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'showcase-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const addProject = (project: ProjectData) => {
    if (!config) return;
    const newConfig = {
      ...config,
      projects: [...config.projects, project]
    };
    saveConfig(newConfig);
  };

  const updateProject = (id: string, updates: Partial<ProjectData>) => {
    if (!config) return;
    const newConfig = {
      ...config,
      projects: config.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    };
    saveConfig(newConfig);
  };

  const deleteProject = (id: string) => {
    if (!config) return;
    const newConfig = {
      ...config,
      projects: config.projects.filter(project => project.id !== id)
    };
    saveConfig(newConfig);
  };

  return {
    config,
    loading,
    error,
    loadConfig,
    saveConfig,
    addProject,
    updateProject,
    deleteProject
  };
};
