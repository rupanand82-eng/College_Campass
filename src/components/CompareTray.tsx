import React from "react";
import { useApp } from "../context/AppContext";
import { Scale, X, ArrowRight } from "lucide-react";

export const CompareTray: React.FC = () => {
  const { comparedColleges, removeFromCompare, clearCompare, navigateTo, activeView } = useApp();

  if (comparedColleges.length === 0 || activeView === "compare") {
    return null;
  }

  return (
    <div
      id="compare-floating-tray"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-3xl shadow-2xl border border-slate-700/60 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-700/80">
            <Scale className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Compare ({comparedColleges.length}/3)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparedColleges.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs shrink-0 max-w-[170px]"
              >
                <img
                  src={c.logoUrl}
                  alt={c.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="truncate text-slate-200 font-medium">{c.name.split("(")[0].trim()}</span>
                <button
                  id={`remove-tray-col-${c.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(c.id);
                  }}
                  className="text-slate-400 hover:text-white transition-colors ml-1 p-0.5 rounded-full"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {comparedColleges.length < 3 && (
              <div className="border border-dashed border-slate-700 rounded-xl px-3 py-1.5 text-[11px] text-slate-400 whitespace-nowrap">
                + Add {3 - comparedColleges.length} more
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            id="clear-tray-btn"
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            Clear
          </button>
          <button
            id="open-compare-btn"
            onClick={() => navigateTo("compare")}
            disabled={comparedColleges.length < 2}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              comparedColleges.length >= 2
                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-blue-500/20"
                : "bg-slate-800/80 text-slate-400 border border-slate-700/80 cursor-not-allowed"
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
