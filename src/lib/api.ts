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

// Base Fetcher Helper with robust error parsing
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `API request failed with status ${res.status}`);
  }

  return json.data as T;
}

export const api = {
  // Fetch colleges list with query filters & pagination
  getColleges: async (params: Record<string, any> = {}): Promise<CollegesResponse> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "all") {
        query.append(key, String(val));
      }
    });
    return fetchApi<CollegesResponse>(`/api/colleges?${query.toString()}`);
  },

  // Fetch filter metadata
  getFilterMeta: async (): Promise<FilterMetaResponse> => {
    return fetchApi<FilterMetaResponse>("/api/colleges/meta/filters");
  },

  // Fetch full college details by slug
  getCollegeDetail: async (slug: string): Promise<CollegeDetailResponse> => {
    return fetchApi<CollegeDetailResponse>(`/api/colleges/${slug}`);
  },

  // Fetch paginated reviews
  getReviews: async (slug: string, cursor?: string, limit = 10): Promise<ReviewsResponse> => {
    const query = new URLSearchParams();
    if (cursor) query.append("cursor", cursor);
    if (limit) query.append("limit", String(limit));
    return fetchApi<ReviewsResponse>(`/api/colleges/${slug}/reviews?${query.toString()}`);
  },

  // Compare 2-3 colleges
  compareColleges: async (collegeIds: string[]): Promise<NormalizedComparisonCollege[]> => {
    return fetchApi<NormalizedComparisonCollege[]>("/api/compare", {
      method: "POST",
      body: JSON.stringify({ collegeIds }),
    });
  },

  // Predict colleges based on rank and exam
  predictColleges: async (body: {
    exam: string;
    rank: number;
    category: string;
    year?: number;
  }): Promise<PredictorResponse> => {
    return fetchApi<PredictorResponse>("/api/predictor", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Get saved items for session
  getSavedItems: async (): Promise<SavedResponse> => {
    return fetchApi<SavedResponse>("/api/saved");
  },

  // Save a college
  saveCollege: async (collegeId: string) => {
    return fetchApi("/api/saved/colleges", {
      method: "POST",
      body: JSON.stringify({ collegeId }),
    });
  },

  // Remove saved college
  removeSavedCollege: async (collegeId: string) => {
    return fetchApi(`/api/saved/colleges/${collegeId}`, {
      method: "DELETE",
    });
  },

  // Save comparison
  saveComparison: async (body: { id?: string; collegeIds: string[]; title?: string }) => {
    return fetchApi("/api/saved/comparisons", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Remove saved comparison
  removeSavedComparison: async (id: string) => {
    return fetchApi(`/api/saved/comparisons/${id}`, {
      method: "DELETE",
    });
  },
};
