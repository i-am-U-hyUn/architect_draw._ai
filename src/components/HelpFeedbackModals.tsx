import React, { useState } from 'react';

interface HelpFeedbackModalsProps {
  isHelpOpen: boolean;
  isFeedbackOpen: boolean;
  isSettingsOpen: boolean;
  onCloseHelp: () => void;
  onCloseFeedback: () => void;
  onCloseSettings: () => void;
}

export const HelpFeedbackModals: React.FC<HelpFeedbackModalsProps> = ({
  isHelpOpen,
  isFeedbackOpen,
  isSettingsOpen,
  onCloseHelp,
  onCloseFeedback,
  onCloseSettings
}) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [gridSnap, setGridSnap] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      onCloseFeedback();
    }, 1800);
  };

  return (
    <>
      {/* Help & Documentation Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-[#121212] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#262626] flex flex-col animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c5a368] text-[22px]">help</span>
                <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand tracking-wide">
                  Architectural Logic Help & Shortcuts
                </h3>
              </div>
              <button onClick={onCloseHelp} className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-[#888888]">
              <div className="p-3 bg-[#161616] rounded-lg border border-[#262626]">
                <h4 className="font-bold text-[#f5f5f5] mb-1.5 flex items-center gap-1.5 font-serif-brand">
                  <span className="material-symbols-outlined text-[16px] text-[#c5a368]">touch_app</span>
                  Canvas Navigation & Connecting
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[#888888] text-[11px] leading-relaxed">
                  <li><strong className="text-[#e2e2e2]">Move Nodes:</strong> Click and drag any node across the dot-grid.</li>
                  <li><strong className="text-[#e2e2e2]">Connect Nodes:</strong> Hover a node to reveal connection pins on left/right and drag to another node.</li>
                  <li><strong className="text-[#e2e2e2]">Inspect Properties:</strong> Click a node to open the live metadata & telemetry panel.</li>
                  <li><strong className="text-[#e2e2e2]">Pan Canvas:</strong> Select the Hand tool from the top toolbar or hold middle click / Space.</li>
                  <li><strong className="text-[#e2e2e2]">Zoom:</strong> Use bottom-right controls (+ / -) or Ctrl + Mouse Wheel.</li>
                </ul>
              </div>

              <div className="p-3 bg-[#161616] rounded-lg border border-[#262626]">
                <h4 className="font-bold text-[#f5f5f5] mb-1.5 flex items-center gap-1.5 font-serif-brand">
                  <span className="material-symbols-outlined text-[16px] text-[#c5a368]">keyboard</span>
                  Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex justify-between"><span className="text-[#888888]">Undo:</span> <kbd className="bg-[#0a0a0a] text-[#c5a368] px-1.5 py-0.5 border border-[#333333] rounded">Ctrl+Z</kbd></div>
                  <div className="flex justify-between"><span className="text-[#888888]">Redo:</span> <kbd className="bg-[#0a0a0a] text-[#c5a368] px-1.5 py-0.5 border border-[#333333] rounded">Ctrl+Y</kbd></div>
                  <div className="flex justify-between"><span className="text-[#888888]">Add Node:</span> <kbd className="bg-[#0a0a0a] text-[#c5a368] px-1.5 py-0.5 border border-[#333333] rounded">A</kbd></div>
                  <div className="flex justify-between"><span className="text-[#888888]">Deselect:</span> <kbd className="bg-[#0a0a0a] text-[#c5a368] px-1.5 py-0.5 border border-[#333333] rounded">Esc</kbd></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#222222]">
              <button
                onClick={onCloseHelp}
                className="px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#262626] flex flex-col animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c5a368] text-[22px]">chat_bubble</span>
                <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand tracking-wide">
                  Send Feedback
                </h3>
              </div>
              <button onClick={onCloseFeedback} className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {feedbackSent ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1c1812] border border-[#c5a368]/50 text-[#c5a368] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <h4 className="font-bold text-sm text-[#f5f5f5] font-serif-brand">Thank you!</h4>
                <p className="text-xs text-[#888888] mt-1">Your feedback has been logged to the engineering backlog.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="py-3 flex flex-col gap-3">
                <p className="text-xs text-[#888888]">
                  Help us refine FluxFlow & Architectural Logic. Share thoughts, requests, or bug reports:
                </p>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What can we improve in this architecture tool?..."
                  className="w-full p-2.5 text-xs bg-[#161616] text-[#e2e2e2] border border-[#333333] rounded-lg outline-none focus:bg-[#1a1a1a] focus:border-[#c5a368]"
                  required
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-[#222222]">
                  <button
                    type="button"
                    onClick={onCloseFeedback}
                    className="px-3 py-1.5 border border-[#333333] rounded-lg text-xs font-semibold text-[#888888] hover:text-[#e2e2e2] hover:bg-[#1a1a1a]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-[#121212] rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#262626] flex flex-col animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c5a368] text-[22px]">tune</span>
                <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand tracking-wide">
                  Workspace Settings
                </h3>
              </div>
              <button onClick={onCloseSettings} className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#f5f5f5]">Snap to 24px Dot-Grid</p>
                  <p className="text-[11px] text-[#888888]">Automatically align node coordinates to the grid.</p>
                </div>
                <input
                  type="checkbox"
                  checked={gridSnap}
                  onChange={(e) => setGridSnap(e.target.checked)}
                  className="w-4 h-4 accent-[#c5a368] rounded"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#222222] pt-3">
                <div>
                  <p className="font-bold text-[#f5f5f5]">Live Telemetry Stream</p>
                  <p className="text-[11px] text-[#888888]">Simulate server access logs in Inspector.</p>
                </div>
                <span className="px-2 py-0.5 bg-[#1c1812] border border-[#c5a368]/40 text-[#c5a368] font-mono font-bold rounded text-[10px]">
                  Enabled
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#222222]">
              <button
                onClick={onCloseSettings}
                className="px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
