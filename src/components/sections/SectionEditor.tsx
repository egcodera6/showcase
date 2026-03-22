import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionType, GridSection, OverviewImageSection, InfoSection, FeaturesSection, StatsSection } from '../../types/sections';
import { Plus, X, GripVertical, Trash2, Edit2, Check } from '../Icons';

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

const sectionTypeLabels: Record<SectionType, { label: string; description: string; icon: string }> = {
  grid: { label: 'Grid Layout', description: 'Image, feature, and content cards', icon: '⊞' },
  'overview-image': { label: 'Overview Image', description: 'Large screenshot or product hero', icon: '□' },
  info: { label: 'Info Section', description: 'Summary, problem, solution, and stack', icon: 'ℹ' },
  features: { label: 'Features List', description: 'Feature callouts with icons', icon: '✓' },
  stats: { label: 'Stats Grid', description: 'Metrics or proof points', icon: '◫' },
};

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const getSectionPreview = (section: Section) => {
  switch (section.type) {
    case 'grid':
      return `${section.items.length} item${section.items.length === 1 ? '' : 's'} • ${section.layout}`;
    case 'overview-image':
      return section.imageUrl ? 'Screenshot ready' : 'Waiting for image URL';
    case 'info':
      return section.title || 'Add a title and summary';
    case 'features':
      return `${section.features.length} feature${section.features.length === 1 ? '' : 's'}`;
    case 'stats':
      return `${section.stats.length} stat${section.stats.length === 1 ? '' : 's'}`;
    default:
      return 'Section';
  }
};

const SectionEditor: React.FC<SectionEditorProps> = ({ sections, onChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const handleAddSection = (type: SectionType) => {
    const newSection = createDefaultSection(type);
    onChange([...sections, newSection]);
    setIsAdding(false);
    setEditingSectionId(newSection.id);
  };

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    const updated = sections.map(s => s.id === id ? { ...s, ...updates } as Section : s);
    onChange(updated);
  };

  const handleDeleteSection = (id: string) => {
    if (window.confirm('Delete this section?')) {
      onChange(sections.filter(s => s.id !== id));
      if (editingSectionId === id) setEditingSectionId(null);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onChange(newSections);
  };

  return (
    <div className="space-y-4">
      {/* Sections List */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <SectionListItem
            key={section.id}
            section={section}
            index={index}
            isEditing={editingSectionId === section.id}
            onEdit={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
            onDelete={() => handleDeleteSection(section.id)}
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < sections.length - 1}
          />
        ))}
      </div>

      {/* Add Section Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      )}

      {/* Section Type Selector */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Select Section Type</h4>
              <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(sectionTypeLabels) as SectionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className="p-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="text-xl mb-1">{sectionTypeLabels[type].icon}</div>
                  <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{sectionTypeLabels[type].label}</div>
                  <div className="text-xs text-slate-500">{sectionTypeLabels[type].description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Editor Panel */}
      <AnimatePresence>
        {editingSectionId && (
          <SectionEditPanel
            section={sections.find(s => s.id === editingSectionId)!}
            onUpdate={(updates) => handleUpdateSection(editingSectionId, updates)}
            onClose={() => setEditingSectionId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionListItem: React.FC<{
  section: Section;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}> = ({ section, index, isEditing, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) => {
  const preview = getSectionPreview(section);

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-slate-800 rounded-lg border ${isEditing ? 'border-primary' : 'border-slate-200 dark:border-slate-700'} p-3`}
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400 cursor-move">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="text-xl">{sectionTypeLabels[section.type].icon}</div>
        <div className="flex-1">
          <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
            {index + 1}. {sectionTypeLabels[section.type].label}
          </div>
          <div className="text-xs text-slate-500">{sectionTypeLabels[section.type].description}</div>
          <div className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">{preview}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
          >
            ↓
          </button>
          <button
            onClick={onEdit}
            className={`p-1.5 rounded ${isEditing ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SectionEditPanel: React.FC<{
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onClose: () => void;
}> = ({ section, onUpdate, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-primary/30 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">Edit {sectionTypeLabels[section.type].label}</h4>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
          <Check className="w-4 h-4" />
        </button>
      </div>

      {section.type === 'grid' && (
        <GridSectionEdit section={section as GridSection} onUpdate={onUpdate} />
      )}
      {section.type === 'overview-image' && (
        <OverviewImageSectionEdit section={section as OverviewImageSection} onUpdate={onUpdate} />
      )}
      {section.type === 'info' && (
        <InfoSectionEdit section={section as InfoSection} onUpdate={onUpdate} />
      )}
      {section.type === 'features' && (
        <FeaturesSectionEdit section={section as FeaturesSection} onUpdate={onUpdate} />
      )}
      {section.type === 'stats' && (
        <StatsSectionEdit section={section as StatsSection} onUpdate={onUpdate} />
      )}
    </motion.div>
  );
};

// Section-specific edit components
const GridSectionEdit: React.FC<{ section: GridSection; onUpdate: (u: Partial<GridSection>) => void }> = ({ section, onUpdate }) => {
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...section.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ items: newItems });
  };

  const addItem = (type: 'image' | 'card' | 'feature-card') => {
    const newItem = {
      id: createId('item'),
      type,
      title: type === 'card' ? 'New Card' : type === 'feature-card' ? 'Feature' : '',
      description: '',
      imageUrl: type === 'image' ? '' : undefined,
      icon: type === 'feature-card' ? 'analytics' : undefined,
    };
    onUpdate({ items: [...section.items, newItem] });
  };

  const removeItem = (index: number) => {
    onUpdate({ items: section.items.filter((_, i) => i !== index) });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= section.items.length) return;
    const newItems = [...section.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onUpdate({ items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Layout</label>
        <select
          value={section.layout}
          onChange={(e) => onUpdate({ layout: e.target.value as any })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        >
          <option value="2x2">2×2 Grid</option>
          <option value="1-2">1 + 2 Columns</option>
          <option value="2-1">2 + 1 Columns</option>
          <option value="1-1-1">3 Equal Columns</option>
        </select>
        <p className="mt-2 text-xs text-slate-500">
          `2x2` works best with 3 to 4 items. Use one image plus one feature card and one content card for a balanced layout.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Grid Items</label>
        <div className="space-y-3">
          {section.items.map((item, index) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                  <select
                    value={item.type}
                    onChange={(e) => updateItem(index, 'type', e.target.value)}
                    className="px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                  >
                    <option value="image">Image</option>
                    <option value="card">Card</option>
                    <option value="feature-card">Feature Card</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30">
                    ↑
                  </button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === section.items.length - 1} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30">
                    ↓
                  </button>
                  <button onClick={() => removeItem(index)} className="p-1 rounded hover:bg-red-100 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item-specific fields */}
              <div className="space-y-2">
                {item.type === 'image' && (
                  <input
                    type="url"
                    value={item.imageUrl || ''}
                    onChange={(e) => updateItem(index, 'imageUrl', e.target.value)}
                    placeholder="Image URL"
                    className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                  />
                )}
                {(item.type === 'card' || item.type === 'feature-card') && (
                  <>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Title"
                      className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                    />
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                    />
                    {item.type === 'feature-card' && (
                      <select
                        value={item.icon || 'analytics'}
                        onChange={(e) => updateItem(index, 'icon', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      >
                        <option value="analytics">Analytics</option>
                        <option value="memory">Memory</option>
                        <option value="clinical">Clinical</option>
                      </select>
                    )}
                    {item.type === 'card' && (
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                        placeholder="Subtitle"
                        className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => addItem('image')}
            className="flex-1 py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:text-primary hover:border-primary"
          >
            + Image
          </button>
          <button
            onClick={() => addItem('card')}
            className="flex-1 py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:text-primary hover:border-primary"
          >
            + Card
          </button>
          <button
            onClick={() => addItem('feature-card')}
            className="flex-1 py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:text-primary hover:border-primary"
          >
            + Feature
          </button>
        </div>
      </div>
    </div>
  );
};

const OverviewImageSectionEdit: React.FC<{ section: OverviewImageSection; onUpdate: (u: Partial<OverviewImageSection>) => void }> = ({ section, onUpdate }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
        <input
          type="url"
          value={section.imageUrl || ''}
          onChange={(e) => onUpdate({ imageUrl: e.target.value })}
          placeholder="https://example.com/image.png"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea
          value={section.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          placeholder="Short supporting context for the overview image"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
    </div>
  );
};

const InfoSectionEdit: React.FC<{ section: InfoSection; onUpdate: (u: Partial<InfoSection>) => void }> = ({ section, onUpdate }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea
          value={section.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Problem</label>
        <textarea
          value={section.problem || ''}
          onChange={(e) => onUpdate({ problem: e.target.value })}
          rows={2}
          placeholder="What problem does this solve?"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Solution</label>
        <textarea
          value={section.solution || ''}
          onChange={(e) => onUpdate({ solution: e.target.value })}
          rows={2}
          placeholder="How does it solve it?"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
        <input
          type="text"
          value={section.techStack?.join(', ') || ''}
          onChange={(e) => onUpdate({ techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="React, TypeScript, Tailwind"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm"
        />
      </div>
    </div>
  );
};

const FeaturesSectionEdit: React.FC<{ section: FeaturesSection; onUpdate: (u: Partial<FeaturesSection>) => void }> = ({ section, onUpdate }) => {
  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...section.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onUpdate({ features: newFeatures });
  };

  const addFeature = () => {
    onUpdate({ features: [...section.features, { icon: 'check', title: 'New Feature', description: '' }] });
  };

  const removeFeature = (index: number) => {
    onUpdate({ features: section.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      {section.features.map((feature, index) => (
        <div key={index} className="bg-white dark:bg-slate-800 rounded p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={feature.title}
              onChange={(e) => updateFeature(index, 'title', e.target.value)}
              placeholder="Feature title"
              className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
            />
            <button onClick={() => removeFeature(index)} className="p-1 text-red-500 hover:bg-red-100 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={feature.description}
            onChange={(e) => updateFeature(index, 'description', e.target.value)}
            placeholder="Feature description"
            className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
          />
        </div>
      ))}
      <button
        onClick={addFeature}
        className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:text-primary hover:border-primary"
      >
        + Add Feature
      </button>
    </div>
  );
};

const StatsSectionEdit: React.FC<{ section: StatsSection; onUpdate: (u: Partial<StatsSection>) => void }> = ({ section, onUpdate }) => {
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...section.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdate({ stats: newStats });
  };

  const addStat = () => {
    onUpdate({ stats: [...section.stats, { label: 'New Stat', value: '0' }] });
  };

  const removeStat = (index: number) => {
    onUpdate({ stats: section.stats.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      {section.stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={stat.label}
            onChange={(e) => updateStat(index, 'label', e.target.value)}
            placeholder="Label"
            className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
          />
          <input
            type="text"
            value={stat.value}
            onChange={(e) => updateStat(index, 'value', e.target.value)}
            placeholder="Value"
            className="w-24 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm"
          />
          <button onClick={() => removeStat(index)} className="p-1 text-red-500 hover:bg-red-100 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addStat}
        className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:text-primary hover:border-primary"
      >
        + Add Stat
      </button>
    </div>
  );
};

// Helper function to create default sections
export const createDefaultSection = (type: SectionType): Section => {
  const id = createId('section');
  switch (type) {
    case 'grid':
      return {
        id,
        type: 'grid',
        layout: '2x2',
        items: [
          { id: createId('item'), type: 'image', imageUrl: '' },
          {
            id: createId('item'),
            type: 'feature-card',
            title: 'Core highlight',
            description: 'Use the featured card for a key differentiator, metric, or capability.',
            icon: 'analytics',
          },
          {
            id: createId('item'),
            type: 'card',
            title: 'Support detail',
            subtitle: 'Context',
            description: 'Use the card for supporting narrative, workflow context, or a UI explanation.',
          },
        ],
      };
    case 'overview-image':
      return {
        id,
        type: 'overview-image',
        imageUrl: '',
        title: 'Product overview',
        description: 'Add a screenshot that communicates the product experience at a glance.',
      };
    case 'info':
      return {
        id,
        type: 'info',
        title: 'Project overview',
        description: 'Summarize the product, outcome, or strategic context for this slide.',
        problem: 'Describe the user or business problem here.',
        solution: 'Explain how the product or feature solves that problem.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      };
    case 'features':
      return {
        id,
        type: 'features',
        features: [
          { icon: 'check', title: 'Feature 1', description: 'Description' },
          { icon: 'check', title: 'Feature 2', description: 'Description' },
        ],
      };
    case 'stats':
      return {
        id,
        type: 'stats',
        stats: [
          { label: 'Users', value: '1,000+' },
          { label: 'Growth', value: '25%' },
        ],
      };
    default:
      return { id, type: 'info', title: '', description: '' };
  }
};

export const createStarterSections = (): Section[] => [
  createDefaultSection('info'),
  createDefaultSection('grid'),
  createDefaultSection('overview-image'),
];

export default SectionEditor;
