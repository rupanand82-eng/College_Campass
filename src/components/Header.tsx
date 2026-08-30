import React from "react";
import { useApp } from "../context/AppContext";
import { Compass, Scale, Sparkles, Bookmark, BookOpen, Layers, MessageSquare, ChevronRight } from "lucide-react";

export const Header: React.FC = () => {
  const { activeView, navigateTo, comparedColleges, savedData } = useApp();

  const savedCount = savedData?.savedCollegeIds?.length || 0;
  const compareCount = comparedColleges.length;

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div
            id="brand-logo-button"
            onClick={() => navigateTo("colleges")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-800 group-hover:scale-105 transition-all">
              <Compass className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight font-display">
                  College<span className="text-blue-600">Compass</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Verified admissions, cutoff predictors & placements</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            <button
              id="nav-colleges-btn"
              onClick={() => navigateTo("colleges")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeView === "colleges" || activeView === "detail"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Colleges</span>
            </button>

            <button
              id="nav-compare-btn"
              onClick={() => navigateTo("compare")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                activeView === "compare"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              id="nav-predictor-btn"
              onClick={() => navigateTo("predictor")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeView === "predictor"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Rank Predictor</span>
            </button>

            <button
              id="nav-saved-btn"
              onClick={() => navigateTo("saved")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                activeView === "saved"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Shortlist</span>
              {savedCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Deferred Feature stub as specified in §1: "stub nav entries as Coming soon" */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 bg-white/40 cursor-not-allowed">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span className="text-[11px]">Q&A</span>
              <span className="text-[9px] bg-slate-200 text-slate-600 font-semibold px-1 rounded">Soon</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
