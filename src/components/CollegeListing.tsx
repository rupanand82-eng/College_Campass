import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import { CollegeSummary } from "../types";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Award,
  IndianRupee,
  Scale,
  Bookmark,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
  X,
  GraduationCap,
  Building2,
} from "lucide-react";

export const CollegeListing: React.FC = () => {
  const { navigateTo, isComparing, addToCompare, isSaved, toggleSaveCollege } = useApp();

  // Search & Filter State
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStream, setSelectedStream] = useState("all");
  const [maxFees, setMaxFees] = useState<number>(1500000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<"rating_desc" | "fees_asc" | "fees_desc" | "name_asc">("rating_desc");

  // Pagination state (accumulated colleges + nextCursor)
  const [collegesList, setCollegesList] = useState<CollegeSummary[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCursor(undefined); // Reset pagination on search change
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset pagination on filter change
  useEffect(() => {
    setCursor(undefined);
  }, [selectedState, selectedCity, selectedType, selectedStream, maxFees, minRating, sort]);

  // Load Filter Metadata
  const { data: filterMeta } = useQuery({
    queryKey: ["filterMeta"],
    queryFn: api.getFilterMeta,
  });

  // Query Colleges
  const { data: queryData, isLoading, isFetching } = useQuery({
    queryKey: [
      "colleges",
      debouncedSearch,
      selectedState,
      selectedCity,
      selectedType,
      selectedStream,
      maxFees,
      minRating,
      sort,
      cursor,
    ],
    queryFn: () =>
      api.getColleges({
        q: debouncedSearch,
        state: selectedState,
        city: selectedCity,
        type: selectedType,
        stream: selectedStream,
        maxFees: maxFees < 1500000 ? maxFees : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        sort,
        cursor,
        limit: 12,
      }),
  });

  // Accumulate colleges or replace if cursor was reset
  useEffect(() => {
    if (queryData?.colleges) {
      if (!cursor) {
        setCollegesList(queryData.colleges);
      } else {
        setCollegesList((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newItems = queryData.colleges.filter((c) => !existingIds.has(c.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [queryData, cursor]);

  const handleLoadMore = () => {
    if (queryData?.nextCursor) {
      setCursor(queryData.nextCursor);
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedState("all");
    setSelectedCity("all");
    setSelectedType("all");
    setSelectedStream("all");
    setMaxFees(1500000);
    setMinRating(0);
    setSort("rating_desc");
    setCursor(undefined);
  };

  const hasActiveFilters =
    debouncedSearch !== "" ||
    selectedState !== "all" ||
    selectedCity !== "all" ||
    selectedType !== "all" ||
    selectedStream !== "all" ||
    maxFees < 1500000 ||
    minRating > 0 ||
    sort !== "rating_desc";

  const formatFee = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh/yr`;
    }
    return `₹${amount.toLocaleString()}/yr`;
  };

  return (
    <div id="college-listing-page" className="py-6 sm:py-8">
      {/* Bento Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        {/* Main Search Bento Card */}
        <div className="lg:col-span-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover 40+ Top Indian Universities & Institutes</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 font-display">
              Find Your Ideal College & Engineering Dream
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed max-w-2xl">
              Real NIRF rankings, verified historical placement packages, official entrance exam cutoffs (JEE Main, Advanced, NEET, CAT), and student reviews.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative z-10 flex items-center rounded-2xl overflow-hidden bg-white text-slate-800 shadow-sm border border-slate-200">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              id="search-college-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by college name (e.g. IIT Bombay, BITS Pilani), city, or state..."
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 text-sm sm:text-base outline-hidden text-slate-900 placeholder:text-slate-400"
            />
            {searchInput && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchInput("")}
                className="absolute right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bento Side Columns */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rankings & NIRF</div>
              <div className="text-sm font-extrabold text-slate-900">100% Official MHRD</div>
              <div className="text-[11px] text-slate-500">Updated 2024-2025 scores</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Data</div>
              <div className="text-sm font-extrabold text-slate-900">₹8L - ₹2.1 Cr CTC</div>
              <div className="text-[11px] text-slate-500">Verified alumni reports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs sticky top-22">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          <div className="space-y-5">
            {/* Stream */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Stream / Discipline</label>
              <select
                id="filter-stream-select"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-hidden focus:border-blue-500"
              >
                <option value="all">All Streams</option>
                {filterMeta?.streams.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">State</label>
              <select
                id="filter-state-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("all");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-hidden focus:border-blue-500"
              >
                <option value="all">All States</option>
                {filterMeta?.states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City</label>
              <select
                id="filter-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-hidden focus:border-blue-500"
              >
                <option value="all">All Cities</option>
                {filterMeta?.cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Institution Type</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {["all", "Government", "Private", "Deemed"].map((t) => (
                  <button
                    key={t}
                    id={`filter-type-${t.toLowerCase()}`}
                    onClick={() => setSelectedType(t)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      selectedType === t ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t === "all" ? "All" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Fees Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-slate-500">Max Annual Fee</span>
                <span className="font-semibold text-blue-700">{maxFees >= 1500000 ? "Any Fee" : formatFee(maxFees)}</span>
              </div>
              <input
                id="filter-fees-slider"
                type="range"
                min="50000"
                max="1500000"
                step="50000"
                value={maxFees}
                onChange={(e) => setMaxFees(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50k</span>
                <span>₹5L</span>
                <span>₹10L</span>
                <span>₹15L+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Minimum Rating</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 3.5, 4.0, 4.5].map((rt) => (
                  <button
                    key={rt}
                    id={`filter-rating-${rt}`}
                    onClick={() => setMinRating(rt)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                      minRating === rt
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>{rt === 0 ? "Any" : `${rt}+`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3">
          {/* Controls Bar: Count, Sort, Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {queryData?.totalCount ?? collegesList.length} Colleges Found
              </span>
              {isFetching && <span className="text-xs text-blue-600 animate-pulse font-medium">Updating...</span>}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                id="mobile-filter-drawer-toggle"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters {hasActiveFilters && "•"}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
                <select
                  id="sort-colleges-select"
                  value={sort}
                  onChange={(e: any) => setSort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-hidden focus:border-blue-500"
                >
                  <option value="rating_desc">Highest Rated</option>
                  <option value="fees_asc">Fees: Low to High</option>
                  <option value="fees_desc">Fees: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-400 font-medium">Active:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs border border-blue-200">
                  Search: "{debouncedSearch}"
                  <button onClick={() => setSearchInput("")}>
                    <X className="w-3 h-3 text-blue-600 hover:text-blue-900" />
                  </button>
                </span>
              )}
              {selectedStream !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs border border-slate-200">
                  Stream: {selectedStream}
                  <button onClick={() => setSelectedStream("all")}>
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </span>
              )}
              {selectedState !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs border border-slate-200">
                  State: {selectedState}
                  <button onClick={() => setSelectedState("all")}>
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </span>
              )}
              {selectedType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs border border-slate-200">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType("all")}>
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </span>
              )}
              {maxFees < 1500000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs border border-slate-200">
                  Fee ≤ {formatFee(maxFees)}
                  <button onClick={() => setMaxFees(1500000)}>
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs border border-amber-200">
                  Rating ≥ {minRating}★
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3 text-amber-600" />
                  </button>
                </span>
              )}
              <button
                id="clear-all-chips-btn"
                onClick={handleClearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && collegesList.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden animate-pulse">
                  <div className="h-44 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                    <div className="h-8 bg-slate-100 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && collegesList.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No colleges match your current filters</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Try expanding your fee range, choosing a different stream or resetting search keywords to view all 40+ premier colleges.
              </p>
              <button
                id="empty-state-reset-btn"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collegesList.map((col) => {
              const comparing = isComparing(col.id);
              const saved = isSaved(col.id);

              return (
                <div
                  key={col.id}
                  id={`college-card-${col.slug}`}
                  onClick={() => navigateTo("detail", col.slug)}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col cursor-pointer"
                >
                  {/* Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={col.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"}
                      alt={col.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* Top Pills */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {col.nirfRank && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-600/95 text-white text-[11px] font-bold shadow-md flex items-center gap-1 backdrop-blur-xs">
                          <Award className="w-3 h-3" />
                          NIRF #{col.nirfRank}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-200 text-[11px] font-medium backdrop-blur-xs border border-white/10">
                        {col.type}
                      </span>
                    </div>

                    {/* Bookmark Quick Action */}
                    <button
                      id={`save-col-${col.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveCollege(col);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                        saved
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900/60 hover:bg-slate-900 text-white/90 hover:text-white"
                      }`}
                      title={saved ? "Saved in shortlist" : "Save to shortlist"}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
                    </button>

                    {/* Rating badge bottom right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs font-bold border border-white/10 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{col.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({col.reviewCount})</span>
                    </div>

                    {/* Location bottom left */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-slate-200 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{col.city}, {col.state}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Established */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {col.name}
                        </h3>
                      </div>

                      {/* Streams */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {col.streams.map((st) => (
                          <span
                            key={st}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/50"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Annual Tuition</div>
                        <div className="text-sm font-bold text-slate-900">{formatFee(col.feesPerYear)}</div>
                      </div>

                      {/* Action buttons: Compare toggle + View Details */}
                      <div className="flex items-center gap-2">
                        <button
                          id={`compare-toggle-col-${col.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCompare(col);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            comparing
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{comparing ? "Comparing" : "Compare"}</span>
                        </button>

                        <span className="p-1 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {queryData?.nextCursor && (
            <div className="mt-8 text-center">
              <button
                id="load-more-colleges-btn"
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-semibold text-sm transition-all shadow-xs inline-flex items-center gap-2"
              >
                {isFetching ? "Loading more colleges..." : "Load More Colleges"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Filter Colleges</span>
                </div>
                <button
                  id="close-mobile-filter-btn"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stream</label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="all">All Streams</option>
                    {filterMeta?.streams.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value="all">All States</option>
                    {filterMeta?.states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Max Annual Fees</label>
                  <input
                    type="range"
                    min="50000"
                    max="1500000"
                    step="50000"
                    value={maxFees}
                    onChange={(e) => setMaxFees(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs font-semibold text-blue-600 mt-1">
                    {maxFees >= 1500000 ? "Any Fee" : formatFee(maxFees)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
