import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  MapPin,
  Star,
  Award,
  Building2,
  Calendar,
  IndianRupee,
  Scale,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  ThumbsUp,
  Landmark,
  Compass,
} from "lucide-react";

export const CollegeDetail: React.FC = () => {
  const { selectedCollegeSlug, navigateTo, isComparing, addToCompare, isSaved, toggleSaveCollege, showToast } =
    useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews" | "cutoffs">("overview");
  const [upvotedReviews, setUpvotedReviews] = useState<Set<string>>(new Set());

  const slug = selectedCollegeSlug || "iit-bombay";

  // Query College Full Details
  const { data, isLoading, error } = useQuery({
    queryKey: ["collegeDetail", slug],
    queryFn: () => api.getCollegeDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="py-12 max-w-5xl mx-auto px-4">
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse mb-8" />
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-1/3 mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">College Profile Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The requested college details could not be loaded. Please return to the college directory.
        </p>
        <button
          onClick={() => navigateTo("colleges")}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700"
        >
          Back to Colleges Directory
        </button>
      </div>
    );
  }

  const { college, courses, placements, reviews, ratingDistribution } = data;

  const comparing = isComparing(college.id);
  const saved = isSaved(college.id);

  const formatFee = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh/yr`;
    }
    return `₹${amount.toLocaleString()}/yr`;
  };

  const handleUpvoteReview = (reviewId: string) => {
    setUpvotedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
        showToast("Thank you for your feedback!");
      }
      return next;
    });
  };

  // Prepare chart data from placements subcollection
  const placementChartData = placements
    .slice()
    .reverse()
    .map((p) => ({
      year: `${p.year}`,
      "Average CTC (LPA)": p.avgPackageLPA,
      "Median CTC (LPA)": p.medianPackageLPA,
      "Highest CTC (LPA)": p.highestPackageLPA,
    }));

  return (
    <div id="college-detail-page" className="py-6 sm:py-8 max-w-6xl mx-auto">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button
          id="breadcrumb-back-btn"
          onClick={() => navigateTo("colleges")}
          className="hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Colleges</span>
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-md">{college.name}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs mb-8">
        {/* Banner with overlay */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={college.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80"}
            alt={college.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            {college.nirfRank && (
              <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
                <Award className="w-4 h-4" />
                NIRF #{college.nirfRank}
              </span>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              {college.type}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Profile
            </span>
          </div>

          {/* Action Buttons Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="detail-save-btn"
              onClick={() => toggleSaveCollege(college)}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-sm flex items-center gap-2 text-xs font-semibold ${
                saved
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
              <span className="hidden sm:inline">{saved ? "Shortlisted" : "Shortlist"}</span>
            </button>

            <button
              id="detail-compare-btn"
              onClick={() => addToCompare(college)}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-sm flex items-center gap-2 text-xs font-semibold ${
                comparing
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{comparing ? "In Compare Tray" : "Add to Compare"}</span>
            </button>
          </div>

          {/* Title & Info Bottom */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 font-display">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{college.city}, {college.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Estd. {college.established}</span>
                  </div>
                  {college.campusSizeAcres && (
                    <div className="flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-blue-400" />
                      <span>{college.campusSizeAcres} Acres Campus</span>
                    </div>
                  )}
                </div>
              </div>

              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors border border-white/20 self-start sm:self-auto shrink-0"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bento Quick Highlights Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/70 p-4 border-t border-slate-100 text-center">
          <div className="p-3">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">Overall Rating</div>
            <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-lg">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>{college.rating.toFixed(1)}</span>
              <span className="text-xs font-normal text-slate-500">/ 5 ({college.reviewCount})</span>
            </div>
          </div>

          <div className="p-3">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">Annual Tuition</div>
            <div className="text-slate-900 font-bold text-lg">{formatFee(college.feesPerYear)}</div>
          </div>

          <div className="p-3">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">Latest Avg Package</div>
            <div className="text-emerald-700 font-bold text-lg">
              {placements[0] ? `₹${placements[0].avgPackageLPA} LPA` : "N/A"}
            </div>
          </div>

          <div className="p-3">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">Placement Rate</div>
            <div className="text-blue-700 font-bold text-lg">
              {placements[0] ? `${placements[0].placementPercentage}%` : "90%+"}
            </div>
          </div>
        </div>
      </div>

      {/* Bento Interactive Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto mb-6 scrollbar-none max-w-fit">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "courses", label: `Courses & Fees (${courses.length})`, icon: GraduationCap },
          { id: "placements", label: "Placements & Salaries", icon: Briefcase },
          { id: "reviews", label: `Reviews (${reviews.length})`, icon: MessageSquare },
          { id: "cutoffs", label: "Cutoffs & Admission", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 font-display">
              About {college.name}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-6">
              {college.overview}
            </p>

            {/* Highlights */}
            {college.highlights && college.highlights.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Highlights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {college.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accreditations */}
            {college.accreditations && college.accreditations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Recognitions & Accreditations</h4>
                <div className="flex flex-wrap gap-2">
                  {college.accreditations.map((acc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Bento Tile for Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Campus Infrastructure</h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Campus Size</span>
                  <span className="font-bold text-slate-900">{college.campusSizeAcres ? `${college.campusSizeAcres} Acres` : "Sprawling Urban"}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Institution Type</span>
                  <span className="font-bold text-slate-900">{college.type}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>State / Location</span>
                  <span className="font-bold text-slate-900">{college.state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Streams</span>
                  <span className="font-bold text-slate-900">{college.streams.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-xs border border-slate-800">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Need Personalized Counseling?</span>
              </div>
              <h4 className="font-bold text-base mb-2">Predict Your Admission Odds</h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Input your exam rank (JEE / NEET / CAT) into our official predictor algorithm to check historical closing cutoff matches.
              </p>
              <button
                onClick={() => navigateTo("predictor")}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-2xl transition-colors shadow-xs"
              >
                Launch Rank Predictor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Courses & Fees */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {course.degree}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{course.durationYears} Years Duration</span>
                    {course.seats && (
                      <span className="text-xs text-slate-400">• {course.seats} Seats Intake</span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-1">{course.name}</h4>
                  {course.eligibility && (
                    <p className="text-xs text-slate-500">
                      <strong className="text-slate-700">Eligibility:</strong> {course.eligibility}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-xs text-slate-400 uppercase font-bold">Annual Tuition</div>
                  <div className="text-base font-bold text-slate-900">{formatFee(course.feesPerYear)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Placements */}
      {activeTab === "placements" && (
        <div className="space-y-6">
          {/* Chart Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 font-display">
              Placement Salary Trends (LPA)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Verified year-over-year corporate compensation packages in Lakhs Per Annum (INR).
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} unit="L" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "none", color: "#fff" }}
                    formatter={(val: any) => [`₹${val} LPA`, ""]}
                  />
                  <Legend />
                  <Bar dataKey="Average CTC (LPA)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Median CTC (LPA)" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Highest CTC (LPA)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Recruiters */}
          {placements[0]?.topRecruiters && placements[0].topRecruiters.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 font-display">
                Top Corporate Recruiters
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {placements[0].topRecruiters.map((rec, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Reviews */}
      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Rating Breakdown */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs h-fit">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-display">Rating Breakdown</h3>
            <div className="text-center pb-6 border-b border-slate-100 mb-6">
              <div className="text-4xl font-extrabold text-slate-900 mb-1">{college.rating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(college.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-slate-500">Based on {college.reviewCount} student reviews</div>
            </div>

            {/* Stars Progress */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0;
                const pct = college.reviewCount > 0 ? (count / college.reviewCount) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-8 font-medium">{stars} ★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Reviews Feed */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((rev) => {
              const hasUpvoted = upvotedReviews.has(rev.id);
              return (
                <div key={rev.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rev.authorName}</span>
                        {rev.verifiedStudent && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Alum
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {rev.course} • Batch of {rev.batchYear}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-800 mb-2">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{rev.body}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <button
                      id={`upvote-rev-${rev.id}`}
                      onClick={() => handleUpvoteReview(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                        hasUpvoted
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? "fill-blue-600 text-blue-600" : ""}`} />
                      <span>Helpful ({rev.helpfulCount + (hasUpvoted ? 1 : 0)})</span>
                    </button>

                    <span className="text-slate-400 text-[11px]">Reviewed on CollegeCompass</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 5: Cutoffs & Admission */}
      {activeTab === "cutoffs" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Entrance Exam Closing Cutoffs
              </h3>
              <p className="text-xs text-slate-500">
                Official historical closing ranks across premier national counseling rounds.
              </p>
            </div>

            <button
              id="goto-predictor-from-detail"
              onClick={() => navigateTo("predictor")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Test My Rank in Predictor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">General Category</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">Top ~1% Cutoff</div>
              <p className="text-xs text-slate-500 mt-1">
                Typical closing rank ranges for Computer Science, Electrical & Mechanical programs.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Reserved Categories</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">Relaxed Ranks (OBC/SC/ST/EWS)</div>
              <p className="text-xs text-slate-500 mt-1">
                Seat matrix reservation allocations applied according to central government mandates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
