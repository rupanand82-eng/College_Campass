import { SEED_COLLEGES } from "../data/seedColleges";
import {
  College,
  CollegeSummary,
  Course,
  PlacementYear,
  Review,
  PredictorCutoff,
  PredictionResult,
  SavedComparison,
  NormalizedComparisonCollege,
} from "../types";
import {
  CollegesResponse,
  CollegeDetailResponse,
  ReviewsResponse,
  PredictorResponse,
  SavedResponse,
  FilterMetaResponse,
} from "./api";

const SAVED_COLLEGES_KEY = "cc_saved_colleges";
const SAVED_COMPARISONS_KEY = "cc_saved_comparisons";

class LocalDataStore {
  private colleges: College[] = [];
  private coursesMap: Map<string, Course[]> = new Map();
  private placementsMap: Map<string, PlacementYear[]> = new Map();
  private reviewsMap: Map<string, Review[]> = new Map();
  private cutoffsList: PredictorCutoff[] = [];

  constructor() {
    for (const item of SEED_COLLEGES) {
      this.colleges.push(item.college);
      this.coursesMap.set(item.college.id, item.courses);
      this.placementsMap.set(item.college.id, item.placements);
      this.reviewsMap.set(item.college.id, item.reviews);
      if (item.cutoffs) {
        this.cutoffsList.push(...item.cutoffs);
      }
    }
  }

  public getFiltersMetadata(): FilterMetaResponse {
    const states = Array.from(new Set(this.colleges.map((c) => c.state))).sort();
    const cities = Array.from(new Set(this.colleges.map((c) => c.city))).sort();
    const streams = Array.from(new Set(this.colleges.flatMap((c) => c.streams))).sort();
    const types = Array.from(new Set(this.colleges.map((c) => c.type))).sort();

    return {
      states,
      cities,
      streams,
      types,
      totalColleges: this.colleges.length,
    };
  }

  public getColleges(params: Record<string, any> = {}): CollegesResponse {
    let list = [...this.colleges];

    if (params.search && typeof params.search === "string" && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.streams.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params.state && params.state !== "all") {
      list = list.filter((c) => c.state.toLowerCase() === params.state.toLowerCase());
    }

    if (params.city && params.city !== "all") {
      list = list.filter((c) => c.city.toLowerCase() === params.city.toLowerCase());
    }

    if (params.type && params.type !== "all") {
      list = list.filter((c) => c.type === params.type);
    }

    if (params.stream && params.stream !== "all") {
      list = list.filter((c) => c.streams.some((s) => s.toLowerCase() === params.stream.toLowerCase()));
    }

    if (params.minFees !== undefined && params.minFees !== "") {
      list = list.filter((c) => c.feesPerYear >= Number(params.minFees));
    }
    if (params.maxFees !== undefined && params.maxFees !== "") {
      list = list.filter((c) => c.feesPerYear <= Number(params.maxFees));
    }

    if (params.minRating !== undefined && Number(params.minRating) > 0) {
      list = list.filter((c) => c.rating >= Number(params.minRating));
    }

    const sort = params.sort || "rating_desc";
    list.sort((a, b) => {
      switch (sort) {
        case "fees_asc":
          return a.feesPerYear - b.feesPerYear;
        case "fees_desc":
          return b.feesPerYear - a.feesPerYear;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "rating_desc":
        default:
          return b.rating - a.rating || (a.nirfRank || 999) - (b.nirfRank || 999);
      }
    });

    const totalCount = list.length;
    const limit = Math.min(Number(params.limit) || 12, 50);

    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = list.findIndex((c) => c.id === params.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedItems = list.slice(startIndex, startIndex + limit);
    const lastItem = paginatedItems[paginatedItems.length - 1];
    const nextCursor = startIndex + limit < totalCount && lastItem ? lastItem.id : null;

    const summaries: CollegeSummary[] = paginatedItems.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      city: c.city,
      state: c.state,
      location: c.location,
      type: c.type,
      established: c.established,
      feesPerYear: c.feesPerYear,
      rating: c.rating,
      reviewCount: c.reviewCount,
      logoUrl: c.logoUrl,
      imageUrl: c.imageUrl,
      streams: c.streams,
      nirfRank: c.nirfRank,
    }));

    return {
      colleges: summaries,
      nextCursor,
      totalCount,
    };
  }

  public getCollegeDetail(slug: string): CollegeDetailResponse | null {
    const college = this.colleges.find((c) => c.slug === slug || c.id === slug);
    if (!college) return null;

    const courses = this.coursesMap.get(college.id) || [];
    const placements = (this.placementsMap.get(college.id) || []).slice(0, 2);
    const allReviews = this.reviewsMap.get(college.id) || [];
    const firstPageReviews = allReviews.slice(0, 5);

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allReviews) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }

    return {
      college,
      courses,
      placements,
      reviews: firstPageReviews,
      ratingDistribution: distribution,
    };
  }

  public getReviews(slug: string, cursor?: string, limit = 10): ReviewsResponse | null {
    const college = this.colleges.find((c) => c.slug === slug || c.id === slug);
    if (!college) return null;

    const allReviews = this.reviewsMap.get(college.id) || [];
    const totalReviews = allReviews.length;
    const safeLimit = Math.min(limit, 50);

    let startIndex = 0;
    if (cursor) {
      const idx = allReviews.findIndex((r) => r.id === cursor);
      if (idx !== -1) startIndex = idx + 1;
    }

    const paginated = allReviews.slice(startIndex, startIndex + safeLimit);
    const lastItem = paginated[paginated.length - 1];
    const nextCursor = startIndex + safeLimit < totalReviews && lastItem ? lastItem.id : null;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allReviews) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }

    return {
      reviews: paginated,
      nextCursor,
      totalReviews,
      ratingDistribution: distribution,
    };
  }

  public compareColleges(collegeIds: string[]): NormalizedComparisonCollege[] {
    const results: NormalizedComparisonCollege[] = [];

    for (const cid of collegeIds) {
      const college = this.colleges.find((c) => c.id === cid || c.slug === cid);
      if (!college) continue;

      const courses = this.coursesMap.get(college.id) || [];
      const placements = this.placementsMap.get(college.id) || [];
      const latestPlacement = placements.length > 0 ? placements[0] : null;

      results.push({
        id: college.id,
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        type: college.type,
        established: college.established,
        feesPerYear: college.feesPerYear,
        rating: college.rating,
        reviewCount: college.reviewCount,
        logoUrl: college.logoUrl,
        imageUrl: college.imageUrl,
        nirfRank: college.nirfRank,
        streams: college.streams,
        latestPlacement,
        coursesCount: courses.length,
        topCourses: courses.slice(0, 3).map((c) => c.name),
        website: college.website,
      });
    }

    return results;
  }

  public predictColleges(params: {
    exam: string;
    rank: number;
    category: string;
    year?: number;
  }): PredictorResponse {
    const userRank = params.rank;
    const targetYear = params.year || 2024;

    let matched = this.cutoffsList.filter(
      (c) =>
        c.exam.toLowerCase() === params.exam.toLowerCase() &&
        c.category.toLowerCase() === params.category.toLowerCase() &&
        (!params.year || c.year === targetYear)
    );

    if (matched.length === 0) {
      matched = this.cutoffsList.filter(
        (c) =>
          c.exam.toLowerCase() === params.exam.toLowerCase() &&
          c.category === "General" &&
          (!params.year || c.year === targetYear)
      );
    }

    const safe: PredictionResult[] = [];
    const moderate: PredictionResult[] = [];
    const ambitious: PredictionResult[] = [];

    for (const cutoff of matched) {
      const college = this.colleges.find((c) => c.id === cutoff.collegeId);
      if (!college) continue;

      const summary: CollegeSummary = {
        id: college.id,
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        location: college.location,
        type: college.type,
        established: college.established,
        feesPerYear: college.feesPerYear,
        rating: college.rating,
        reviewCount: college.reviewCount,
        logoUrl: college.logoUrl,
        imageUrl: college.imageUrl,
        streams: college.streams,
        nirfRank: college.nirfRank,
      };

      const closing = cutoff.closingRank;
      const ratio = userRank / closing;

      if (ratio < 0.8) {
        const prob = Math.min(99, Math.round(100 - ratio * 30));
        safe.push({
          cutoff,
          college: summary,
          bucket: "safe",
          probabilityScore: prob,
          marginText: `Your rank #${userRank.toLocaleString()} is comfortably within cutoff #${closing.toLocaleString()} (+${Math.round((1 - ratio) * 100)}% buffer)`,
        });
      } else if (ratio <= 1.0) {
        const prob = Math.round(75 - (ratio - 0.8) * 125);
        moderate.push({
          cutoff,
          college: summary,
          bucket: "moderate",
          probabilityScore: Math.max(50, Math.min(75, prob)),
          marginText: `Competitive match: rank #${userRank.toLocaleString()} is close to closing rank #${closing.toLocaleString()}`,
        });
      } else if (ratio <= 1.15) {
        const prob = Math.round(40 - (ratio - 1.0) * 180);
        ambitious.push({
          cutoff,
          college: summary,
          bucket: "ambitious",
          probabilityScore: Math.max(15, Math.min(40, prob)),
          marginText: `Stretch reach: rank #${userRank.toLocaleString()} is ~${Math.round((ratio - 1) * 100)}% above normal closing rank #${closing.toLocaleString()} (possible in sliding/spot rounds)`,
        });
      }
    }

    safe.sort((a, b) => b.probabilityScore - a.probabilityScore);
    moderate.sort((a, b) => b.probabilityScore - a.probabilityScore);
    ambitious.sort((a, b) => b.probabilityScore - a.probabilityScore);

    return {
      safe,
      moderate,
      ambitious,
      querySummary: {
        exam: params.exam,
        rank: params.rank,
        category: params.category,
        totalMatches: safe.length + moderate.length + ambitious.length,
      },
    };
  }

  // Local storage based persistence for shortlists & comparisons
  public getLocalSaved(): SavedResponse {
    let savedIds: string[] = [];
    let comparisons: SavedComparison[] = [];

    try {
      const rawIds = localStorage.getItem(SAVED_COLLEGES_KEY);
      if (rawIds) savedIds = JSON.parse(rawIds);

      const rawComps = localStorage.getItem(SAVED_COMPARISONS_KEY);
      if (rawComps) comparisons = JSON.parse(rawComps);
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const savedSummaries: CollegeSummary[] = savedIds
      .map((id) => this.colleges.find((c) => c.id === id || c.slug === id))
      .filter(Boolean)
      .map((college) => ({
        id: college!.id,
        name: college!.name,
        slug: college!.slug,
        city: college!.city,
        state: college!.state,
        location: college!.location,
        type: college!.type,
        established: college!.established,
        feesPerYear: college!.feesPerYear,
        rating: college!.rating,
        reviewCount: college!.reviewCount,
        logoUrl: college!.logoUrl,
        imageUrl: college!.imageUrl,
        streams: college!.streams,
        nirfRank: college!.nirfRank,
      }));

    return {
      sessionId: "local-client-session",
      savedColleges: savedSummaries,
      savedCollegeIds: savedIds,
      savedComparisons: comparisons,
    };
  }

  public saveLocalCollege(collegeId: string): string[] {
    const data = this.getLocalSaved();
    if (!data.savedCollegeIds.includes(collegeId)) {
      data.savedCollegeIds.push(collegeId);
      try {
        localStorage.setItem(SAVED_COLLEGES_KEY, JSON.stringify(data.savedCollegeIds));
      } catch {}
    }
    return data.savedCollegeIds;
  }

  public removeLocalCollege(collegeId: string): string[] {
    const data = this.getLocalSaved();
    const updated = data.savedCollegeIds.filter((id) => id !== collegeId);
    try {
      localStorage.setItem(SAVED_COLLEGES_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  }

  public saveLocalComparison(item: { id?: string; collegeIds: string[]; title?: string }): SavedComparison[] {
    const data = this.getLocalSaved();
    const newComp: SavedComparison = {
      id: item.id || `comp-${Date.now()}`,
      collegeIds: item.collegeIds,
      title: item.title || "College Comparison",
      createdAt: Date.now(),
    };
    data.savedComparisons.push(newComp);
    try {
      localStorage.setItem(SAVED_COMPARISONS_KEY, JSON.stringify(data.savedComparisons));
    } catch {}
    return data.savedComparisons;
  }

  public removeLocalComparison(id: string): SavedComparison[] {
    const data = this.getLocalSaved();
    const updated = data.savedComparisons.filter((c) => c.id !== id);
    try {
      localStorage.setItem(SAVED_COMPARISONS_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  }
}

export const localStore = new LocalDataStore();
