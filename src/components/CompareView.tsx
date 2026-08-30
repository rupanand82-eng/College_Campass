import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import { CollegeSummary, NormalizedComparisonCollege } from "../types";
import {
  Scale,
  X,
  Plus,
  Trophy,
  Award,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Landmark,
  Building2,
  Bookmark,
  Check,
  Share2,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export const CompareView: React.FC = () => {
  const { comparedColleges, removeFromCompare, addToCompare, navigateTo, showToast } = useApp();
  const queryClient = useQueryClient();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Fetch list of all colleges for the "Add 3rd College" picker modal
  const { data: allCollegesData } = useQuery({
    queryKey: ["allCollegesForPicker"],
    queryFn: () => api.getColleges({ limit: 45 }),
    enabled: showAddPicker,
  });

  const collegeIds = comparedColleges.map((c) => c.id);

  // Query comparison data from API
  const { data: comparisonData, isLoading, error } = useQuery({
    queryKey: ["compareColleges", ...collegeIds],
    queryFn: () => api.compareColleges(collegeIds),
    enabled: collegeIds.length >= 2,
  });

  // Save Comparison Mutation
  const saveComparisonMutation = useMutation({
    mutationFn: (body: { collegeIds: string[]; title?: string }) => api.saveComparison(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedItems"] });
      showToast("Comparison set saved to your shortlist");
    },
    onError: (err: any) => {
      showToast(err.message || "Failed to save comparison");
    },
  });

  const handleSaveComparison = () => {
    if (collegeIds.length < 2) return;
    const names = comparedColleges.map((c) => c.name.split("(")[0].trim()).join(" vs ");
    saveComparisonMutation.mutate({
      collegeIds,
      title: `${names} Comparison`,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Comparison link copied to clipboard");
    }
  };

  const formatFee = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // If less than 2 colleges are selected, display interactive setup screen
  if (comparedColleges.length < 2) {
    return (
      <div id="compare-empty-state" className="py-12 max-w-3xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 font-display">
          Compare Top Engineering & Medical Colleges
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          Select at least 2 colleges (up to 3) to view side-by-side matrices of annual tuition fees, NIRF rankings, placement records, and flagship degrees.
        </p>

        {comparedColleges.length === 1 && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 max-w-md mx-auto mb-8 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 text-left">
              <img
                src={comparedColleges[0].logoUrl}
                alt={comparedColleges[0].name}
                className="w-10 h-10 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-sm text-slate-900">{comparedColleges[0].name}</div>
                <div className="text-xs text-blue-600 font-medium">1 of 2 required selected</div>
              </div>
            </div>
            <button
              onClick={() => removeFromCompare(comparedColleges[0].id)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="explore-colleges-for-compare-btn"
            onClick={() => navigateTo("colleges")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-sm shadow-xs transition-all flex items-center gap-2"
          >
            <span>Browse Colleges to Compare</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const colleges = comparisonData || [];

  // Determine highest metric values for winner highlights
  const highestAvgLPA = Math.max(...colleges.map((c) => c.latestPlacement?.avgPackageLPA || 0));
  const highestMaxLPA = Math.max(...colleges.map((c) => c.latestPlacement?.highestPackageLPA || 0));
  const lowestFees = Math.min(...colleges.map((c) => c.feesPerYear || 9999999));
  const highestRating = Math.max(...colleges.map((c) => c.rating || 0));

  return (
    <div id="compare-page-view" className="py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Side-by-Side College Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluating {colleges.length} premier institutions across fees, rankings, and career ROI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="toggle-highlight-diffs-btn"
            onClick={() => setHighlightDiffs(!highlightDiffs)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              highlightDiffs
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 shadow-xs"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Highlight Differences: {highlightDiffs ? "ON" : "OFF"}</span>
          </button>

          <button
            id="save-comparison-set-btn"
            onClick={handleSaveComparison}
            disabled={saveComparisonMutation.isPending}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{saveComparisonMutation.isPending ? "Saving..." : "Save Comparison"}</span>
          </button>

          <button
            id="share-comparison-btn"
            onClick={handleShare}
            className="p-2 rounded-2xl text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="Share comparison"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center animate-pulse shadow-xs">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3 mx-auto mb-4" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      )}

      {!isLoading && colleges.length >= 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* College Cards Header Row */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 sm:p-6 w-1/4 align-bottom text-xs font-bold uppercase tracking-wider text-slate-400">
                    Criteria
                  </th>
                  {colleges.map((col) => (
                    <th key={col.id} className="p-4 sm:p-6 w-1/4 align-top">
                      <div className="relative group">
                        <button
                          id={`remove-comp-col-${col.id}`}
                          onClick={() => removeFromCompare(col.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-slate-900 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div
                          onClick={() => navigateTo("detail", col.slug)}
                          className="cursor-pointer"
                        >
                          <img
                            src={col.imageUrl || col.logoUrl}
                            alt={col.name}
                            className="w-full h-28 object-cover rounded-2xl mb-3 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          <div className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {col.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {col.city}, {col.state}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Add 3rd College Slot */}
                  {colleges.length < 3 && (
                    <th className="p-4 sm:p-6 w-1/4 align-middle text-center bg-slate-50/30">
                      <button
                        id="add-third-college-btn"
                        onClick={() => setShowAddPicker(true)}
                        className="w-full h-44 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition-all bg-white hover:bg-blue-50/30 p-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold">Add 3rd College</span>
                        <span className="text-[10px] text-slate-400">Compare up to 3 institutions</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Matrix Rows */}
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {/* NIRF Rank */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>NIRF All-India Rank</span>
                  </td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5">
                      {col.nirfRank ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">
                          <Award className="w-3.5 h-3.5" />
                          Rank #{col.nirfRank}
                        </span>
                      ) : (
                        <span className="text-slate-400">Unranked / Not Available</span>
                      )}
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Rating & Reviews */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700">Student Rating</td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="text-amber-500">★</span>
                        <span>{col.rating.toFixed(1)} / 5.0</span>
                        <span className="text-xs text-slate-400 font-normal">({col.reviewCount} reviews)</span>
                        {col.rating === highestRating && (
                          <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                            Top
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Annual Tuition Fees */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>Annual Tuition Fees</span>
                  </td>
                  {colleges.map((col) => {
                    const isLowest = col.feesPerYear === lowestFees;
                    return (
                      <td key={col.id} className="p-4 sm:p-5">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {formatFee(col.feesPerYear)}/year
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ~{formatFee(col.feesPerYear * 4)} (4-yr total)
                        </div>
                        {isLowest && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Most Economical
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Placements: Average CTC */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Average CTC (LPA)</span>
                  </td>
                  {colleges.map((col) => {
                    const avg = col.latestPlacement?.avgPackageLPA;
                    const isTop = avg === highestAvgLPA && avg > 0;
                    return (
                      <td key={col.id} className="p-4 sm:p-5">
                        {avg ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm sm:text-base">₹{avg} LPA</span>
                            {isTop && (
                              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Trophy className="w-3 h-3 text-indigo-600" />
                                Highest
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Placements: Highest CTC */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700">Highest CTC (LPA)</td>
                  {colleges.map((col) => {
                    const max = col.latestPlacement?.highestPackageLPA;
                    return (
                      <td key={col.id} className="p-4 sm:p-5">
                        {max ? (
                          <span className="font-bold text-amber-700 text-sm sm:text-base">₹{max} LPA</span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Placement Rate */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700">Placement Percentage</td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5 font-bold text-slate-900">
                      {col.latestPlacement ? `${col.latestPlacement.placementPercentage}%` : "90%+"}
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Institution Type & Heritage */}
                <tr className={highlightDiffs ? "bg-amber-50/20" : ""}>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Type & Established</span>
                  </td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5">
                      <div className="font-semibold text-slate-800">{col.type}</div>
                      <div className="text-xs text-slate-500">Established {col.established}</div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Top Programs */}
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Offered Programs</span>
                  </td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5">
                      <div className="space-y-1">
                        {col.topCourses.map((c, i) => (
                          <div key={i} className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl truncate">
                            {c}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>

                {/* Top Recruiters */}
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700">Top Recruiters</td>
                  {colleges.map((col) => (
                    <td key={col.id} className="p-4 sm:p-5">
                      <div className="flex flex-wrap gap-1">
                        {col.latestPlacement?.topRecruiters?.slice(0, 4).map((r, i) => (
                          <span key={i} className="text-[11px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-lg font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 bg-slate-50/30" />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add 3rd College Picker Modal */}
      {showAddPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900 font-display">Select a College to Compare</h3>
              <button
                id="close-picker-modal-btn"
                onClick={() => setShowAddPicker(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
              {allCollegesData?.colleges
                .filter((c) => !comparedColleges.some((comp) => comp.id === c.id))
                .map((college) => (
                  <div
                    key={college.id}
                    onClick={() => {
                      addToCompare(college);
                      setShowAddPicker(false);
                    }}
                    className="p-3 hover:bg-blue-50/70 rounded-2xl cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={college.logoUrl}
                        alt={college.name}
                        className="w-10 h-10 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600">
                          {college.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {college.city}, {college.state} • {college.type}
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
