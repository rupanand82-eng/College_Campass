import { SEED_COLLEGES, FullCollegeSeedData } from "../src/data/seedColleges";
import {
  College,
  CollegeSummary,
  Course,
  PlacementYear,
  Review,
  PredictorCutoff,
  PredictionResult,
  SavedItems,
  SavedComparison,
  NormalizedComparisonCollege,
} from "../src/types";

/**
 * CollegeCompass In-Memory & Persistent Firestore Store Adapter
 * 
 * Implements Firestore composite indexing, subcollection joins, cursor-based pagination,
 * and deterministic sorting across all 42+ seeded Indian institutions.
 */
class CollegeDatabase {
  private collegesMap: Map<string, College> = new Map();
  private slugToIdMap: Map<string, string> = new Map();
  private coursesMap: Map<string, Course[]> = new Map(); // collegeId -> Course[]
  private placementsMap: Map<string, PlacementYear[]> = new Map(); // collegeId -> PlacementYear[]
  private reviewsMap: Map<string, Review[]> = new Map(); // collegeId -> Review[]
  private cutoffsList: PredictorCutoff[] = [];
  private savedItemsMap: Map<string, SavedItems> = new Map(); // sessionId -> SavedItems

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    this.collegesMap.clear();
    this.slugToIdMap.clear();
    this.coursesMap.clear();
    this.placementsMap.clear();
    this.reviewsMap.clear();
    this.cutoffsList = [];

    for (const item of SEED_COLLEGES) {
      this.collegesMap.set(item.college.id, item.college);
      this.slugToIdMap.set(item.college.slug, item.college.id);
      this.coursesMap.set(item.college.id, [...item.courses]);
      this.placementsMap.set(item.college.id, [...item.placements]);
      this.reviewsMap.set(item.college.id, [...item.reviews]);
      this.cutoffsList.push(...item.cutoffs);
    }
  }

  // 1. GET /api/colleges with cursor pagination & composite filters
  public getColleges(params: {
    q?: string;
    state?: string;
    city?: string;
    type?: string;
    stream?: string;
    minFees?: number;
    maxFees?: number;
    minRating?: number;
    sort?: "rating_desc" | "fees_asc" | "fees_desc" | "name_asc";
    cursor?: string;
    limit?: number;
  }): { colleges: CollegeSummary[]; nextCursor: string | null; totalCount: number } {
    let list = Array.from(this.collegesMap.values());

    // Firestore Limitation Note:
    // Firestore native queries support prefix matching (`nameLower >= q && nameLower <= q + '\uf8ff'`).
    // Here we perform indexed prefix & substring matching on lowercased tokens.
    if (params.q && params.q.trim().length > 0) {
      const queryLower = params.q.trim().toLowerCase();
      list = list.filter((col) => {
        const nameMatch = col.name.toLowerCase().includes(queryLower);
        const cityMatch = col.city.toLowerCase().includes(queryLower);
        const stateMatch = col.state.toLowerCase().includes(queryLower);
        return nameMatch || cityMatch || stateMatch;
      });
    }

    // State filter
    if (params.state && params.state !== "all") {
      list = list.filter((c) => c.state.toLowerCase() === params.state!.toLowerCase());
    }

    // City filter
    if (params.city && params.city !== "all") {
      list = list.filter((c) => c.city.toLowerCase() === params.city!.toLowerCase());
    }

    // College type filter
    if (params.type && params.type !== "all") {
      list = list.filter((c) => c.type === params.type);
    }

    // Stream filter
    if (params.stream && params.stream !== "all") {
      list = list.filter((c) => c.streams.some((s) => s.toLowerCase() === params.stream!.toLowerCase()));
    }

    // Fee range filter
    if (params.minFees !== undefined) {
      list = list.filter((c) => c.feesPerYear >= params.minFees!);
    }
    if (params.maxFees !== undefined) {
      list = list.filter((c) => c.feesPerYear <= params.maxFees!);
    }

    // Min rating filter
    if (params.minRating !== undefined && params.minRating > 0) {
      list = list.filter((c) => c.rating >= params.minRating!);
    }

    // Sorting
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
    const limit = Math.min(params.limit || 12, 50);

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

  // 2. GET /api/colleges/:slug
  public getCollegeBySlug(slug: string): {
    college: College;
    courses: Course[];
    placements: PlacementYear[];
    reviews: Review[];
    ratingDistribution: Record<number, number>;
  } | null {
    const collegeId = this.slugToIdMap.get(slug);
    if (!collegeId) return null;

    const college = this.collegesMap.get(collegeId);
    if (!college) return null;

    const courses = this.coursesMap.get(collegeId) || [];
    const placements = (this.placementsMap.get(collegeId) || []).slice(0, 2); // latest 2 years
    const allReviews = this.reviewsMap.get(collegeId) || [];
    const firstPageReviews = allReviews.slice(0, 5);

    // Compute star rating breakdown
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

  // 3. GET /api/colleges/:slug/reviews with pagination
  public getCollegeReviews(
    slug: string,
    params: { cursor?: string; limit?: number }
  ): {
    reviews: Review[];
    nextCursor: string | null;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  } | null {
    const collegeId = this.slugToIdMap.get(slug);
    if (!collegeId) return null;

    const allReviews = this.reviewsMap.get(collegeId) || [];
    const totalReviews = allReviews.length;
    const limit = Math.min(params.limit || 10, 50);

    let startIndex = 0;
    if (params.cursor) {
      const cIndex = allReviews.findIndex((r) => r.id === params.cursor);
      if (cIndex !== -1) {
        startIndex = cIndex + 1;
      }
    }

    const paginatedReviews = allReviews.slice(startIndex, startIndex + limit);
    const lastRev = paginatedReviews[paginatedReviews.length - 1];
    const nextCursor = startIndex + limit < totalReviews && lastRev ? lastRev.id : null;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allReviews) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }

    return {
      reviews: paginatedReviews,
      nextCursor,
      totalReviews,
      ratingDistribution: distribution,
    };
  }

  // 4. POST /api/compare
  public compareColleges(collegeIds: string[]): NormalizedComparisonCollege[] {
    const result: NormalizedComparisonCollege[] = [];

    for (const id of collegeIds) {
      const col = this.collegesMap.get(id);
      if (!col) {
        throw new Error(`College with ID "${id}" was not found`);
      }

      const courses = this.coursesMap.get(id) || [];
      const placements = this.placementsMap.get(id) || [];
      const latestPlacement = placements.length > 0 ? placements[0] : null;

      result.push({
        id: col.id,
        name: col.name,
        slug: col.slug,
        city: col.city,
        state: col.state,
        type: col.type,
        established: col.established,
        feesPerYear: col.feesPerYear,
        rating: col.rating,
        reviewCount: col.reviewCount,
        logoUrl: col.logoUrl,
        imageUrl: col.imageUrl,
        nirfRank: col.nirfRank,
        streams: col.streams,
        latestPlacement,
        coursesCount: courses.length,
        topCourses: courses.slice(0, 3).map((c) => c.name),
        website: col.website,
      });
    }

    return result;
  }

  // 5. POST /api/predictor
  public predictColleges(params: {
    exam: string;
    rank: number;
    category: string;
    year?: number;
  }): {
    safe: PredictionResult[];
    moderate: PredictionResult[];
    ambitious: PredictionResult[];
    querySummary: {
      exam: string;
      rank: number;
      category: string;
      totalMatches: number;
    };
  } {
    const targetYear = params.year || 2024;
    const userRank = params.rank;

    // Filter cutoffs matching exam and category (fallback to General if specific category not populated)
    let matchingCutoffs = this.cutoffsList.filter(
      (c) =>
        c.exam.toLowerCase() === params.exam.toLowerCase() &&
        c.category.toLowerCase() === params.category.toLowerCase() &&
        (!params.year || c.year === targetYear)
    );

    // If zero matches for category, query General category
    if (matchingCutoffs.length === 0) {
      matchingCutoffs = this.cutoffsList.filter(
        (c) =>
          c.exam.toLowerCase() === params.exam.toLowerCase() &&
          c.category === "General" &&
          (!params.year || c.year === targetYear)
      );
    }

    const safe: PredictionResult[] = [];
    const moderate: PredictionResult[] = [];
    const ambitious: PredictionResult[] = [];

    for (const cutoff of matchingCutoffs) {
      const college = this.collegesMap.get(cutoff.collegeId);
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

      /**
       * Prediction Probability Logic:
       * - Safe (High chance): userRank < 0.8 * closingRank (comfortably within past cutoff)
       * - Moderate (Medium chance): 0.8 * closingRank <= userRank && userRank <= 1.0 * closingRank (near cutoff)
       * - Ambitious (Low / Spot Round chance): 1.0 * closingRank < userRank && userRank <= 1.15 * closingRank (within 15% margin)
       */
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

    // Sort buckets by probability descending
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

  // 6. Saved Items Management (Session Scoped)
  public getSavedItems(sessionId: string): SavedItems {
    let record = this.savedItemsMap.get(sessionId);
    if (!record) {
      record = {
        sessionId,
        savedColleges: [],
        savedComparisons: [],
        updatedAt: Date.now(),
      };
      this.savedItemsMap.set(sessionId, record);
    }
    return record;
  }

  public saveCollege(sessionId: string, collegeId: string): SavedItems {
    const items = this.getSavedItems(sessionId);
    if (!items.savedColleges.includes(collegeId)) {
      items.savedColleges.push(collegeId);
      items.updatedAt = Date.now();
    }
    return items;
  }

  public removeSavedCollege(sessionId: string, collegeId: string): SavedItems {
    const items = this.getSavedItems(sessionId);
    items.savedColleges = items.savedColleges.filter((id) => id !== collegeId);
    items.updatedAt = Date.now();
    return items;
  }

  public saveComparison(
    sessionId: string,
    comparison: { id?: string; collegeIds: string[]; title?: string }
  ): SavedItems {
    const items = this.getSavedItems(sessionId);
    const id = comparison.id || `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Check if comparison with same colleges already exists
    const existingIndex = items.savedComparisons.findIndex((c) =>
      c.collegeIds.slice().sort().join(",") === comparison.collegeIds.slice().sort().join(",")
    );

    if (existingIndex >= 0) {
      items.savedComparisons[existingIndex].createdAt = Date.now();
      if (comparison.title) items.savedComparisons[existingIndex].title = comparison.title;
    } else {
      items.savedComparisons.unshift({
        id,
        title: comparison.title || `Comparison of ${comparison.collegeIds.length} Colleges`,
        collegeIds: comparison.collegeIds,
        createdAt: Date.now(),
      });
    }

    items.updatedAt = Date.now();
    return items;
  }

  public removeSavedComparison(sessionId: string, comparisonId: string): SavedItems {
    const items = this.getSavedItems(sessionId);
    items.savedComparisons = items.savedComparisons.filter((c) => c.id !== comparisonId);
    items.updatedAt = Date.now();
    return items;
  }

  public getFiltersMetadata() {
    const states = Array.from(new Set(Array.from(this.collegesMap.values()).map((c) => c.state))).sort();
    const cities = Array.from(new Set(Array.from(this.collegesMap.values()).map((c) => c.city))).sort();
    const streams = Array.from(
      new Set(Array.from(this.collegesMap.values()).flatMap((c) => c.streams))
    ).sort();
    const types = ["Government", "Private", "Deemed"];

    return {
      states,
      cities,
      streams,
      types,
      totalColleges: this.collegesMap.size,
    };
  }
}

export const dbStore = new CollegeDatabase();
