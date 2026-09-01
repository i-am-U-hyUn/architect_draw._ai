import React, { useState } from 'react';
import { ArchTemplate } from '../types';

interface TemplatesViewProps {
  templates: ArchTemplate[];
  onSelectTemplate: (template: ArchTemplate) => void;
  onStartBlankCanvas: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onSelectTemplate,
  onStartBlankCanvas
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory === 'All Categories') return true;
    return t.category === selectedCategory;
  });

  const currentSelected = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleUseTemplate = (tmpl: ArchTemplate) => {
    onSelectTemplate(tmpl);
  };

  return (
    <main className="flex-1 relative dot-grid overflow-y-auto bg-[#0a0a0a] select-none">
      <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl text-[#f5f5f5] mb-1.5 font-serif-brand tracking-wide">
              Template Library
            </h1>
            <p className="text-sm md:text-base text-[#888888] max-w-2xl leading-relaxed">
              Start your next architecture diagram with a pre-configured, best-practice structure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#141414] border border-[#262626] text-xs font-semibold rounded-lg focus:ring-2 focus:ring-[#c5a368]/30 focus:border-[#c5a368] py-2 pl-3 pr-8 shadow-sm outline-none cursor-pointer text-[#e2e2e2]"
            >
              <option>All Categories</option>
              <option>Infrastructure</option>
              <option>Pipelines</option>
              <option>User Journeys</option>
              <option>Architecture</option>
            </select>

            <div className="flex bg-[#161616] border border-[#262626] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded shadow-sm transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#c5a368] text-[#0a0a0a]' : 'text-[#777777] hover:text-[#f0f0f0]'
                }`}
                title="Grid View"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded shadow-sm transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#c5a368] text-[#0a0a0a]' : 'text-[#777777] hover:text-[#f0f0f0]'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>
          </div>
        </header>

        {/* Bento Grid Gallery */}
        <div className={`grid gap-6 pb-24 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredTemplates.map((template, idx) => {
            const isSelected = selectedTemplateId === template.id;
            const isFeatured = template.isFeatured;

            return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={`${
                  isFeatured && viewMode === 'grid' ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1'
                } bg-[#121212] rounded-xl border ${
                  isSelected ? 'border-[#c5a368] ring-2 ring-[#c5a368]/30 shadow-xl' : 'border-[#222222] shadow-md'
                } overflow-hidden flex flex-col group cursor-pointer hover:border-[#c5a368] transition-all duration-200`}
              >
                {/* Visual Banner Header */}
                <div className={`${
                  isFeatured ? 'h-60 md:h-64' : 'h-44 md:h-48'
                } bg-[#0e0e0e] relative p-5 overflow-hidden flex items-center justify-center border-b border-[#222222]`}>
                  {/* Subtle architectural schematic graphics */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0e0e0e] via-[#141414] to-[#1c1812]/50 flex items-center justify-center p-4">
                    <div className="w-full h-full relative border border-dashed border-[#333333] rounded-lg flex items-center justify-center">
                      <div className="flex items-center gap-4 opacity-90 group-hover:scale-105 transition-transform duration-300">
                        {template.nodes.slice(0, 3).map((n, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="px-3 py-2 bg-[#161616] rounded-md border border-[#2a2a2a] shadow-md text-xs font-semibold text-[#e2e2e2] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-[#c5a368]">
                                {n.icon}
                              </span>
                              <span>{n.title}</span>
                            </div>
                            {i < 2 && (
                              <span className="material-symbols-outlined text-[#777777] text-[16px]">
                                arrow_forward
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isFeatured && (
                    <div className="absolute top-4 right-4 bg-[#1c1812]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#c5a368] border border-[#c5a368]/30 shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Featured
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#f5f5f5] group-hover:text-[#c5a368] transition-colors mb-2 font-serif-brand">
                      {template.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#888888] mb-4 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-[#1a1a1a]">
                    {template.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 bg-[#181818] border border-[#262626] rounded-md text-[11px] font-semibold text-[#a0a0a0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Blank Canvas Action Card */}
          <div
            onClick={onStartBlankCanvas}
            className="col-span-1 bg-[#101010] border-2 border-dashed border-[#2a2a2a] rounded-xl flex items-center justify-center p-6 hover:border-[#c5a368] hover:bg-[#141414] transition-all duration-200 cursor-pointer group min-h-[260px]"
          >
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#181818] border border-[#333333] rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:border-[#c5a368] transition-all">
                <span className="material-symbols-outlined text-[#c5a368] text-[28px]">add</span>
              </div>
              <h3 className="font-bold text-base text-[#f0f0f0] mb-1 font-serif-brand">
                Blank Canvas
              </h3>
              <p className="text-xs text-[#777777]">Start entirely from scratch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      {currentSelected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#141414] border border-[#2a2a2a] text-[#e2e2e2] rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl z-50 animate-in slide-in-from-bottom-3 select-none popover-shadow">
          <span className="text-xs font-medium text-[#888888]">
            Selected: <span className="font-bold text-[#f5f5f5] font-serif-brand">{currentSelected.title}</span>
          </span>
          <div className="w-px h-4 bg-[#333333]" />
          <button
            onClick={() => handleUseTemplate(currentSelected)}
            className="bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
          >
            <span>Use Template</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </main>
  );
};
