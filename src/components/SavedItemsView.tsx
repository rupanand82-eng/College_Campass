import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Bookmark,
  Scale,
  Trash2,
  ChevronRight,
  ExternalLink,
  Building2,
  Star,
  MapPin,
  Award,
  Share2,
} from "lucide-react";

export const SavedItemsView: React.FC = () => {
  const { savedData, toggleSaveCollege, deleteSavedComparison, navigateTo, addToCompare, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<"colleges" | "comparisons">("colleges");

  const savedColleges = savedData?.savedColleges || [];
  const savedComparisons = savedData?.savedComparisons || [];

  const formatFee = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh/yr`;
    }
    return `₹${amount.toLocaleString()}/yr`;
  };

  const handleShareShortlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Shortlist link copied to clipboard");
    }
  };

  return (
    <div id="saved-items-view-page" className="py-6 sm:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Bookmark className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>Personal Shortlist & Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Your Shortlisted Colleges & Saved Comparisons
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Persisted securely to your session so you can review choices with mentors and parents.
          </p>
        </div>

        <button
          onClick={handleShareShortlist}
          className="px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Shortlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
        <button
          id="saved-colleges-tab-btn"
          onClick={() => setActiveTab("colleges")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === "colleges"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-xs"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Shortlisted Colleges ({savedColleges.length})</span>
        </button>

        <button
          id="saved-comparisons-tab-btn"
          onClick={() => setActiveTab("comparisons")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === "comparisons"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-xs"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Saved Comparisons ({savedComparisons.length})</span>
        </button>
      </div>

      {/* Tab 1: Shortlisted Colleges */}
      {activeTab === "colleges" && (
        <div>
          {savedColleges.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No colleges shortlisted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Click the bookmark icon on any college card or detail page to add it to your shortlist for fast access.
              </p>
              <button
                onClick={() => navigateTo("colleges")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-xs transition-colors"
              >
                Browse All Colleges
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedColleges.map((col) => (
                <div
                  key={col.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={col.logoUrl}
                      alt={col.name}
                      className="w-12 h-12 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {col.nirfRank && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-lg border border-blue-200/60">
                            NIRF #{col.nirfRank}
                          </span>
                        )}
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-lg">
                          {col.type}
                        </span>
                      </div>
                      <h4
                        onClick={() => navigateTo("detail", col.slug)}
                        className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                      >
                        {col.name}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>
                          {col.city}, {col.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Annual Tuition</div>
                      <div className="text-xs font-bold text-slate-900">{formatFee(col.feesPerYear)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveCollege(col)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl text-xs transition-colors"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => addToCompare(col)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Compare
                      </button>

                      <button
                        onClick={() => navigateTo("detail", col.slug)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Comparisons */}
      {activeTab === "comparisons" && (
        <div>
          {savedComparisons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No saved comparisons</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                When you compare 2-3 colleges on the Compare page, click "Save Comparison" to bookmark your comparison set.
              </p>
              <button
                onClick={() => navigateTo("colleges")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-xs transition-colors"
              >
                Go to Colleges Directory
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedComparisons.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-1">{comp.title}</h4>
                    <div className="text-xs text-slate-500">
                      Comparing {comp.collegeIds.length} Institutions • Saved on{" "}
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteSavedComparison(comp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl text-xs transition-colors"
                      title="Delete comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        navigateTo("compare");
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>Open Comparison</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
