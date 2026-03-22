import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useShowcaseConfig } from '../hooks/useShowcaseConfig';
import { 
  Plus, Edit2, Trash2, Save, X, DeployedCode, ViewQuilt
} from './Icons';
import SectionEditor, { createStarterSections } from './sections/SectionEditor';
import { Section } from '../types/sections';

interface ProjectFormData {
  id: string;
  title: string;
  type: 'cover' | 'browser-mockup' | 'project-details' | 'call-to-action';
  data: any;
  sections?: Section[];
}

const cloneProjectData = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const normalizeProjectForSave = (project: ProjectFormData): ProjectFormData => {
  const normalized = cloneProjectData(project);

  if (normalized.type === 'project-details') {
    normalized.data = normalized.data || {};
    normalized.data.projectName = normalized.data.projectName || normalized.title;
    normalized.data.platform = normalized.data.platform || normalized.data.metadata?.platform || '';
    normalized.data.status = normalized.data.status || normalized.data.metadata?.status || 'prototype';
    normalized.data.tags = normalized.data.tags || normalized.data.metadata?.tags || [];
    normalized.data.metadata = {
      ...(normalized.data.metadata || {}),
      platform: normalized.data.platform,
      status: normalized.data.status,
      tags: normalized.data.tags,
    };

    // Ensure first info section is updated with latest global data if sections exist
    if (normalized.sections) {
      const infoSection = normalized.sections.find((s) => s.type === 'info');
      if (infoSection && infoSection.type === 'info') {
        infoSection.problem = normalized.data.problem || infoSection.problem;
        infoSection.solution = normalized.data.solution || infoSection.solution;
        infoSection.techStack = normalized.data.techStack || infoSection.techStack;
        infoSection.description = normalized.data.description || infoSection.description;
        infoSection.title = normalized.data.headerTitle || infoSection.title;
      }

      // Sync Legacy Main Image with first Overview Image section
      const overviewSection = normalized.sections.find((s) => s.type === 'overview-image');
      if (overviewSection && overviewSection.type === 'overview-image' && normalized.data.mainContent?.image) {
        overviewSection.imageUrl = normalized.data.mainContent.image;
      }
    }
  }

  if (normalized.type === 'browser-mockup') {
    normalized.data = normalized.data || {};
    normalized.data.browserContent = normalized.data.browserContent || {
      backgroundImage: normalized.data.images?.main || '',
      overlayElements: [],
      floatingCards: []
    };
  }

  return normalized;
};

const ProjectEditor: React.FC = () => {
  const { config, loading, error, addProject, updateProject, deleteProject } = useShowcaseConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormData | null>(null);

  const projectTemplates = {
    'browser-mockup': {
      projectName: '',
      subtitle: '',
      status: 'prototype',
      url: '',
      description: '',
      features: [],
      browserContent: {
        backgroundImage: '',
        overlayElements: [],
        floatingCards: []
      }
    },
    'project-details': {
      projectName: '',
      headerTitle: '',
      description: '',
      problem: '',
      solution: '',
      techStack: [],
      platform: '',
      status: 'prototype',
      tags: [],
      mainContent: {
        type: 'screenshot',
        title: '',
        subtitle: '',
        description: '',
        image: ''
      },
      sideContent: {
        type: 'ui-highlight',
        title: '',
        description: '',
        image: ''
      },
      features: [],
      metadata: {
        platform: '',
        status: '',
        tags: []
      }
    }
  };

  const handleAddProject = (type: 'browser-mockup' | 'project-details') => {
    const newProject: ProjectFormData = {
      id: `project-${Date.now()}`,
      title: type === 'project-details' ? 'New Details Project' : 'New Browser Project',
      type,
      data: cloneProjectData(projectTemplates[type]),
      sections: type === 'project-details' ? createStarterSections() : undefined,
    };
    setEditingProject(newProject);
    setIsEditing(true);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    const projectToSave = normalizeProjectForSave(editingProject);

    if (config?.projects.find(p => p.id === projectToSave.id)) {
      updateProject(projectToSave.id, projectToSave);
    } else {
      addProject(projectToSave);
    }

    setIsEditing(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(cloneProjectData(project));
    setIsEditing(true);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (!editingProject) return;

    const keys = field.split('.');
    const newData = cloneProjectData(editingProject);
    let current: any = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;

    // Direct Sync: If we update certain fields in data, sync them to the first 'info' section if it exists
    if (newData.type === 'project-details' && newData.sections) {
      const infoSection = newData.sections.find((s) => s.type === 'info');
      if (infoSection && infoSection.type === 'info') {
        if (field === 'data.problem') infoSection.problem = value;
        if (field === 'data.solution') infoSection.solution = value;
        if (field === 'data.techStack') infoSection.techStack = value;
        if (field === 'data.description') infoSection.description = value;
        if (field === 'data.headerTitle') infoSection.title = value;
      }
    }

    setEditingProject(newData);
  };

  if (loading) return <div className="p-8">Loading configuration...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-slate-100">Project Editor</h1>

        {/* Add Project Buttons */}
        <div className="mb-10 flex gap-4">
          <button
            onClick={() => handleAddProject('browser-mockup')}
            className="group relative overflow-hidden flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl hover:text-white transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-700 font-bold text-sm"
          >
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-white/20 transition-colors">
                <Plus className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              Add Browser Project
            </div>
          </button>
          
          <button
            onClick={() => handleAddProject('project-details')}
            className="group relative overflow-hidden flex items-center gap-3 px-6 py-3.5 bg-slate-900 dark:bg-primary text-white rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(89,13,242,0.5)] font-bold text-sm"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            Add Details Project
          </button>
        </div>

        {/* Projects List */}
        <div className="grid gap-6 mb-8">
          {config?.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    {project.type === 'browser-mockup' ? <DeployedCode className="w-8 h-8" /> : <ViewQuilt className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {project.type.replace('-', ' ')}
                      </span>
                      {project.data.status && (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${project.data.status === 'live' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {project.data.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all duration-200 font-bold text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditing && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {config?.projects.find(p => p.id === editingProject.id) ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* Configuration Area */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px]">Basic Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Project ID / Title
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="e.g. My Website Overview"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Slide Type
                      </label>
                      <select
                        value={editingProject.type}
                        onChange={(e) => updateFormData('type', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium appearance-none"
                      >
                        <option value="browser-mockup">Browser Mockup</option>
                        <option value="project-details">Project Details</option>
                        <option value="cover">Cover Slide</option>
                        <option value="call-to-action">Call to Action</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Header & Overview Area */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px]">Header & Overview</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={editingProject.data.projectName || ''}
                        onChange={(e) => updateFormData('data.projectName', e.target.value)}
                        placeholder="e.g. PhysioSim V2"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Platform / Device
                      </label>
                      <input
                        type="text"
                        value={editingProject.data.platform || ''}
                        onChange={(e) => updateFormData('data.platform', e.target.value)}
                        placeholder="e.g. Healthcare Platform"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Catchy Header Title
                    </label>
                    <input
                      type="text"
                      value={editingProject.data.headerTitle || ''}
                      onChange={(e) => updateFormData('data.headerTitle', e.target.value)}
                      placeholder="e.g. Advanced clinical exercise tracking"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Browser Mockup Fields */}
                {editingProject.type === 'browser-mockup' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={editingProject.data.subtitle || ''}
                          onChange={(e) => updateFormData('data.subtitle', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <select
                          value={editingProject.data.status || 'prototype'}
                          onChange={(e) => updateFormData('data.status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        >
                          <option value="prototype">Prototype</option>
                          <option value="beta">Beta</option>
                          <option value="live">Live</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          URL
                        </label>
                        <input
                          type="text"
                          value={editingProject.data.url || ''}
                          onChange={(e) => updateFormData('data.url', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editingProject.data.description || ''}
                        onChange={(e) => updateFormData('data.description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Background Image URL
                      </label>
                      <input
                        type="url"
                        value={editingProject.data.browserContent?.backgroundImage || ''}
                        onChange={(e) => updateFormData('data.browserContent.backgroundImage', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </>
                )}

                {/* Project Details Fields */}
                {editingProject.type === 'project-details' && (
                  <>
                    <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-slate-600 dark:text-slate-300">
                      Project details slides are now section-driven. The fields below populate the slide header and legacy fallback content, while the sections builder controls the visible layout.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={editingProject.data.projectName || ''}
                          onChange={(e) => updateFormData('data.projectName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Header Title
                        </label>
                        <input
                          type="text"
                          value={editingProject.data.headerTitle || ''}
                          onChange={(e) => updateFormData('data.headerTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Platform
                        </label>
                        <input
                          type="text"
                          value={editingProject.data.platform || editingProject.data.metadata?.platform || ''}
                          onChange={(e) => updateFormData('data.platform', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Status
                        </label>
                        <select
                          value={editingProject.data.status || editingProject.data.metadata?.status || 'prototype'}
                          onChange={(e) => updateFormData('data.status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        >
                          <option value="prototype">Prototype</option>
                          <option value="beta">Beta</option>
                          <option value="live">Live</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={(editingProject.data.tags || editingProject.data.metadata?.tags || []).join(', ')}
                          onChange={(e) => updateFormData('data.tags', e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editingProject.data.description || ''}
                        onChange={(e) => updateFormData('data.description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:border-primary transition-colors outline-none font-medium"
                      />
                    </div>
                  </>
                )}

                {/* Content Sections Area */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px]">Content Sections</h3>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <SectionEditor
                      sections={editingProject.sections || []}
                      onChange={(sections) => setEditingProject({ ...editingProject, sections })}
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-8 flex justify-end gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-10">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold text-sm"
                >
                  <Save className="w-5 h-5" />
                  Save Project Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
