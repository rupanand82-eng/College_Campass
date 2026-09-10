import {
  CollegeSummary,
  College,
  Course,
  PlacementYear,
  Review,
  NormalizedComparisonCollege,
  PredictionResult,
  SavedComparison,
  ApiResponse,
} from "../types";
import { localStore } from "./localStore";

export interface CollegesResponse {
  colleges: CollegeSummary[];
  nextCursor: string | null;
  totalCount: number;
}

export interface CollegeDetailResponse {
  college: College;
  courses: Course[];
  placements: PlacementYear[];
  reviews: Review[];
  ratingDistribution: Record<number, number>;
}

export interface ReviewsResponse {
  reviews: Review[];
  nextCursor: string | null;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface PredictorResponse {
  safe: PredictionResult[];
  moderate: PredictionResult[];
  ambitious: PredictionResult[];
  querySummary: {
    exam: string;
    rank: number;
    category: string;
    totalMatches: number;
  };
}

export interface SavedResponse {
  sessionId: string;
  savedColleges: CollegeSummary[];
  savedCollegeIds: string[];
  savedComparisons: SavedComparison[];
}

export interface FilterMetaResponse {
  states: string[];
  cities: string[];
  streams: string[];
  types: string[];
  totalColleges: number;
}

// Resilient Fetcher with safe text-before-parse handling to prevent "Unexpected token 'A'" syntax errors
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
  } catch (netErr: any) {
    throw new Error(netErr?.message || "Network connection error");
  }

  const rawText = await res.text();
  let json: ApiResponse<T> | null = null;
  try {
    json = JSON.parse(rawText);
  } catch (_parseErr) {
    // If the server/Vercel returned plain text (e.g. "A server error occurred: FUNCTION_INVOCATION_FAILED")
    // or HTML error page, surface it cleanly without blowing up with a JSON parse SyntaxError
    const snippet = rawText ? rawText.slice(0, 180).trim() : `HTTP ${res.status}`;
    throw new Error(`Server returned non-JSON response (${res.status}): ${snippet}`);
  }

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `API request failed with status ${res.status}`);
  }

  return json.data as T;
}

export const api = {
  // Fetch colleges list with query filters & pagination (with automatic client fallback)
  getColleges: async (params: Record<string, any> = {}): Promise<CollegesResponse> => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "all") {
          query.append(key, String(val));
        }
      });
      return await fetchApi<CollegesResponse>(`/api/colleges?${query.toString()}`);
    } catch (err) {
      console.warn("API error fetching colleges, activating local fallback:", err);
      return localStore.getColleges(params);
    }
  },

  // Fetch filter metadata (with automatic client fallback)
  getFilterMeta: async (): Promise<FilterMetaResponse> => {
    try {
      return await fetchApi<FilterMetaResponse>("/api/colleges/meta/filters");
    } catch (err) {
      console.warn("API error fetching filter metadata, activating local fallback:", err);
      return localStore.getFiltersMetadata();
    }
  },

  // Fetch full college details by slug (with automatic client fallback)
  getCollegeDetail: async (slug: string): Promise<CollegeDetailResponse> => {
    try {
      return await fetchApi<CollegeDetailResponse>(`/api/colleges/${slug}`);
    } catch (err) {
      console.warn(`API error fetching details for "${slug}", activating local fallback:`, err);
      const fallback = localStore.getCollegeDetail(slug);
      if (!fallback) {
        throw new Error(`College with identifier "${slug}" not found`);
      }
      return fallback;
    }
  },

  // Fetch paginated reviews (with automatic client fallback)
  getReviews: async (slug: string, cursor?: string, limit = 10): Promise<ReviewsResponse> => {
    try {
      const query = new URLSearchParams();
      if (cursor) query.append("cursor", cursor);
      if (limit) query.append("limit", String(limit));
      return await fetchApi<ReviewsResponse>(`/api/colleges/${slug}/reviews?${query.toString()}`);
    } catch (err) {
      console.warn(`API error fetching reviews for "${slug}", activating local fallback:`, err);
      const fallback = localStore.getReviews(slug, cursor, limit);
      if (!fallback) {
        return { reviews: [], nextCursor: null, totalReviews: 0, ratingDistribution: {} };
      }
      return fallback;
    }
  },

  // Compare 2-3 colleges (with automatic client fallback)
  compareColleges: async (collegeIds: string[]): Promise<NormalizedComparisonCollege[]> => {
    try {
      return await fetchApi<NormalizedComparisonCollege[]>("/api/compare", {
        method: "POST",
        body: JSON.stringify({ collegeIds }),
      });
    } catch (err) {
      console.warn("API error comparing colleges, activating local fallback:", err);
      return localStore.compareColleges(collegeIds);
    }
  },

  // Predict colleges based on rank and exam (with automatic client fallback)
  predictColleges: async (body: {
    exam: string;
    rank: number;
    category: string;
    year?: number;
  }): Promise<PredictorResponse> => {
    try {
      return await fetchApi<PredictorResponse>("/api/predictor", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.warn("API error running predictor, activating local fallback:", err);
      return localStore.predictColleges(body);
    }
  },

  // Get saved items for session (with local storage fallback)
  getSavedItems: async (): Promise<SavedResponse> => {
    try {
      return await fetchApi<SavedResponse>("/api/saved");
    } catch (err) {
      console.warn("API error fetching saved items, using local storage:", err);
      return localStore.getLocalSaved();
    }
  },

  // Save a college (with local storage fallback)
  saveCollege: async (collegeId: string) => {
    try {
      return await fetchApi("/api/saved/colleges", {
        method: "POST",
        body: JSON.stringify({ collegeId }),
      });
    } catch (err) {
      console.warn("API error saving college, using local storage:", err);
      return localStore.saveLocalCollege(collegeId);
    }
  },

  // Remove saved college (with local storage fallback)
  removeSavedCollege: async (collegeId: string) => {
    try {
      return await fetchApi(`/api/saved/colleges/${collegeId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("API error removing saved college, using local storage:", err);
      return localStore.removeLocalCollege(collegeId);
    }
  },

  // Save comparison (with local storage fallback)
  saveComparison: async (body: { id?: string; collegeIds: string[]; title?: string }) => {
    try {
      return await fetchApi("/api/saved/comparisons", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.warn("API error saving comparison, using local storage:", err);
      return localStore.saveLocalComparison(body);
    }
  },

  // Remove saved comparison (with local storage fallback)
  removeSavedComparison: async (id: string) => {
    try {
      return await fetchApi(`/api/saved/comparisons/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("API error removing comparison, using local storage:", err);
      return localStore.removeLocalComparison(id);
    }
  },
};
