import React, { useState } from 'react';
import { ArchProjectVersion } from '../types';

interface ProjectsArchiveViewProps {
  projects: ArchProjectVersion[];
  onLoadProject: (project: ArchProjectVersion) => void;
}

export const ProjectsArchiveView: React.FC<ProjectsArchiveViewProps> = ({
  projects,
  onLoadProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [previewProject, setPreviewProject] = useState<ArchProjectVersion | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All Projects') return true;
    return p.category === selectedCategory;
  });

  return (
    <main className="flex-1 overflow-auto dot-grid p-6 md:p-10 flex flex-col select-none bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl text-[#f5f5f5] mb-1.5 font-serif-brand tracking-wide">
              Project Archive
            </h1>
            <p className="text-sm md:text-base text-[#888888]">
              Browse previous flowchart versions and architectural iterations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-[#141414] border border-[#262626] rounded-lg pl-4 pr-10 py-2 text-xs font-semibold focus:outline-none focus:border-[#c5a368] focus:ring-2 focus:ring-[#c5a368]/30 cursor-pointer text-[#e2e2e2] shadow-sm"
              >
                <option>All Projects</option>
                <option>E-Commerce</option>
                <option>Security</option>
                <option>Internal Tools</option>
                <option>Marketing</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#777777] text-[18px]">
                expand_more
              </span>
            </div>

            <button className="flex items-center gap-1.5 border border-[#262626] bg-[#141414] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#e2e2e2] hover:bg-[#1a1a1a] hover:border-[#c5a368]/50 transition-colors shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-[16px] text-[#c5a368]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Bento Grid List View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setPreviewProject(project)}
              className="bg-[#121212] rounded-xl canvas-shadow p-5 flex flex-col hover:border-[#c5a368] hover:ring-2 hover:ring-[#c5a368]/20 transition-all cursor-pointer border border-[#222222] group"
            >
              {/* Header Icon + Version Badge */}
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-[#1c1812] border border-[#c5a368]/30 rounded-lg text-[#c5a368] group-hover:bg-[#c5a368] group-hover:text-[#0a0a0a] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{project.icon || 'account_tree'}</span>
                </div>
                <span className="bg-[#181818] border border-[#262626] text-[#c5a368] px-2.5 py-1 rounded text-xs font-mono font-semibold">
                  {project.version}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-sm text-[#f5f5f5] mb-1 line-clamp-1 group-hover:text-[#c5a368] transition-colors font-serif-brand">
                {project.title}
              </h3>
              <p className="text-[#888888] text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">
                {project.description}
              </p>

              {/* Footer with Timestamp and Author Avatars */}
              <div className="mt-auto border-t border-[#1a1a1a] pt-3 flex justify-between items-center text-xs text-[#777777]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {project.timeAgo}
                </span>

                <div className="flex -space-x-2 overflow-hidden">
                  {project.authors.slice(0, 3).map((author, aIdx) => (
                    <img
                      key={aIdx}
                      className="w-6 h-6 rounded-full border-2 border-[#121212] object-cover shadow-xs"
                      src={author.avatar}
                      alt={author.name}
                      title={author.name}
                    />
                  ))}
                  {project.authors.length > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-[#121212] bg-[#1a1a1a] flex items-center justify-center text-[9px] font-bold text-[#888888]">
                      +{project.authors.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#121212] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#262626] animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#1c1812] border border-[#c5a368]/40 text-[#c5a368] rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{previewProject.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand">
                    {previewProject.title}
                  </h3>
                  <span className="text-xs font-mono text-[#888888]">{previewProject.version} • {previewProject.timeAgo}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewProject(null)}
                className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#a0a0a0] mb-4 leading-relaxed">
              {previewProject.description}
            </p>

            <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#222222] mb-5">
              <h4 className="text-[11px] font-bold text-[#c5a368] uppercase tracking-wider mb-2 font-serif-brand">
                Included Nodes ({previewProject.nodes.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {previewProject.nodes.map((n) => (
                  <span
                    key={n.id}
                    className="px-2 py-1 bg-[#161616] border border-[#262626] rounded text-[11px] font-medium text-[#e2e2e2] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px] text-[#c5a368]">{n.icon}</span>
                    {n.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setPreviewProject(null)}
                className="px-4 py-2 border border-[#333333] rounded-lg text-xs font-semibold text-[#888888] hover:bg-[#1a1a1a] hover:text-[#e2e2e2]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLoadProject(previewProject);
                  setPreviewProject(null);
                }}
                className="px-4 py-2 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restore</span>
                Load into Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
