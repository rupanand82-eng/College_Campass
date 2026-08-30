import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, PredictorResponse } from "../lib/api";
import { useApp } from "../context/AppContext";
import { PredictionResult } from "../types";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scale,
  ChevronRight,
  HelpCircle,
  Award,
  MapPin,
  IndianRupee,
  BookOpen,
  Info,
} from "lucide-react";

export const PredictorView: React.FC = () => {
  const { navigateTo, isComparing, addToCompare, showToast } = useApp();

  const [exam, setExam] = useState<"JEE Main" | "JEE Advanced" | "NEET" | "CAT">("JEE Main");
  const [rankInput, setRankInput] = useState<string>("3500");
  const [category, setCategory] = useState<"General" | "OBC" | "SC" | "ST" | "EWS">("General");
  const [year, setYear] = useState<number>(2024);
  const [activeResultTab, setActiveResultTab] = useState<"all" | "safe" | "moderate" | "ambitious">("all");

  // Mutation for Predictor API
  const predictMutation = useMutation({
    mutationFn: (data: { exam: string; rank: number; category: string; year: number }) =>
      api.predictColleges(data),
    onError: (err: any) => {
      showToast(err.message || "Failed to generate prediction");
    },
  });

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    const rank = parseInt(rankInput, 10);
    if (isNaN(rank) || rank <= 0) {
      showToast("Please enter a valid positive rank");
      return;
    }

    predictMutation.mutate({
      exam,
      rank,
      category,
      year,
    });
  };

  const results: PredictorResponse | undefined = predictMutation.data;

  // Aggregate results based on active tab
  const getDisplayItems = (): PredictionResult[] => {
    if (!results) return [];
    if (activeResultTab === "safe") return results.safe;
    if (activeResultTab === "moderate") return results.moderate;
    if (activeResultTab === "ambitious") return results.ambitious;
    return [...results.safe, ...results.moderate, ...results.ambitious];
  };

  const displayItems = getDisplayItems();

  return (
    <div id="predictor-page-view" className="py-6 sm:py-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Historical Cutoff Predictor</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 font-display">
            College & Branch Predictor
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Enter your entrance exam rank and reservation category to discover high-chance, competitive, and ambitious college options based on multi-round counseling datasets.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Entrance Exam
              </label>
              <select
                id="predictor-exam-select"
                value={exam}
                onChange={(e: any) => setExam(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-hidden focus:border-blue-500"
              >
                <option value="JEE Main">JEE Main (NITs, IIITs, GFTIs)</option>
                <option value="JEE Advanced">JEE Advanced (IITs)</option>
                <option value="NEET">NEET (AIIMS & Medical)</option>
                <option value="CAT">CAT (IIMs & Top B-Schools)</option>
              </select>
            </div>

            {/* Rank Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                All-India Rank (AIR)
              </label>
              <input
                id="predictor-rank-input"
                type="number"
                min="1"
                max="500000"
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                placeholder="e.g. 2450"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Category
              </label>
              <select
                id="predictor-category-select"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-hidden focus:border-blue-500"
              >
                <option value="General">General (Open)</option>
                <option value="OBC">OBC-NCL</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Cutoff Benchmark Year
              </label>
              <select
                id="predictor-year-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-hidden focus:border-blue-500"
              >
                <option value={2024}>2024 (Latest Cutoffs)</option>
                <option value={2023}>2023</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500 hidden sm:block">
              Calculates probability against closing ranks with +/- 15% sliding round buffer.
            </div>
            <button
              id="submit-prediction-btn"
              type="submit"
              disabled={predictMutation.isPending}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{predictMutation.isPending ? "Analyzing Cutoffs..." : "Predict Colleges"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Summary Ribbon Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Safe */}
            <div
              id="filter-safe-bucket-btn"
              onClick={() => setActiveResultTab("safe")}
              className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xs ${
                activeResultTab === "safe"
                  ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400"
                  : "bg-white border-slate-200/80 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  High Chance / Safe
                </span>
                <span className="text-2xl font-extrabold text-emerald-700">{results.safe.length}</span>
              </div>
              <p className="text-xs text-slate-500">
                Rank comfortably within historical closing rank (probability &gt;75%).
              </p>
            </div>

            {/* Moderate */}
            <div
              id="filter-moderate-bucket-btn"
              onClick={() => setActiveResultTab("moderate")}
              className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xs ${
                activeResultTab === "moderate"
                  ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400"
                  : "bg-white border-slate-200/80 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Moderate / Competitive
                </span>
                <span className="text-2xl font-extrabold text-amber-700">{results.moderate.length}</span>
              </div>
              <p className="text-xs text-slate-500">
                Near past closing cutoffs (50% - 75% probability).
              </p>
            </div>

            {/* Ambitious */}
            <div
              id="filter-ambitious-bucket-btn"
              onClick={() => setActiveResultTab("ambitious")}
              className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xs ${
                activeResultTab === "ambitious"
                  ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-400"
                  : "bg-white border-slate-200/80 hover:border-indigo-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-indigo-600" />
                  Ambitious / Stretch
                </span>
                <span className="text-2xl font-extrabold text-indigo-700">{results.ambitious.length}</span>
              </div>
              <p className="text-xs text-slate-500">
                Possible in spot rounds or sliding rounds (15% - 40% probability).
              </p>
            </div>
          </div>

          {/* Results Filter Tabs Bento */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "all", label: `All Options (${results.querySummary.totalMatches})` },
                { id: "safe", label: `Safe (${results.safe.length})` },
                { id: "moderate", label: `Moderate (${results.moderate.length})` },
                { id: "ambitious", label: `Ambitious (${results.ambitious.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResultTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeResultTab === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 px-2">
              Exam: <strong className="text-slate-800">{exam}</strong> | Rank:{" "}
              <strong className="text-slate-800">#{parseInt(rankInput, 10).toLocaleString()}</strong>
            </div>
          </div>

          {/* Matches Grid */}
          {displayItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 mb-1">No matches found for this bucket</h4>
              <p className="text-xs text-slate-500">
                Try selecting "All Options" or adjust your rank and category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayItems.map((item, idx) => {
                const isSafe = item.bucket === "safe";
                const isModerate = item.bucket === "moderate";
                const comparing = isComparing(item.college.id);

                return (
                  <div
                    key={`${item.college.id}-${item.cutoff.course}-${idx}`}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.college.logoUrl}
                        alt={item.college.name}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                              isSafe
                                ? "bg-emerald-100 text-emerald-800"
                                : isModerate
                                ? "bg-amber-100 text-amber-800"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {isSafe ? "High Chance" : isModerate ? "Moderate Match" : "Ambitious Reach"}
                          </span>
                          {item.college.nirfRank && (
                            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/60">
                              NIRF #{item.college.nirfRank}
                            </span>
                          )}
                        </div>

                        <h4
                          onClick={() => navigateTo("detail", item.college.slug)}
                          className="font-bold text-base text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {item.college.name}
                        </h4>

                        <div className="text-xs font-semibold text-slate-700 mb-1">
                          Course: {item.cutoff.course}
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>
                            {item.college.city}, {item.college.state}
                          </span>
                          <span>•</span>
                          <span>Closing Rank: #{item.cutoff.closingRank.toLocaleString()}</span>
                        </div>

                        <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.marginText}
                        </div>
                      </div>
                    </div>

                    {/* Probability & Actions Right */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Admission Probability</div>
                        <div
                          className={`text-lg font-extrabold ${
                            isSafe ? "text-emerald-700" : isModerate ? "text-amber-700" : "text-indigo-700"
                          }`}
                        >
                          ~{item.probabilityScore}% Chance
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCompare(item.college)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            comparing
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{comparing ? "Comparing" : "Compare"}</span>
                        </button>

                        <button
                          onClick={() => navigateTo("detail", item.college.slug)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Educational Guidance Note */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">
                  How Counseling Cutoffs Work in National Portals:
                </strong>
                Closing ranks fluctuate across counseling rounds (JoSAA Rounds 1–6, CSAB Special Rounds, MCC NEET rounds). If your rank falls into the <em>Ambitious</em> category, always include these institutes in higher priority positions during choice filling, followed by <em>Moderate</em> and guaranteed <em>Safe</em> choices to secure your seat.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
