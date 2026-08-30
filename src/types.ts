import { z } from "zod";

export type CollegeType = "Government" | "Private" | "Deemed";

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  location: LocationCoordinates;
  type: CollegeType;
  established: number;
  feesPerYear: number; // in INR
  rating: number; // 0 to 5 (1 decimal)
  reviewCount: number;
  logoUrl: string;
  imageUrl?: string;
  overview: string;
  streams: string[];
  nirfRank?: number;
  campusSizeAcres?: number;
  accreditations?: string[];
  highlights?: string[];
  website?: string;
  createdAt: number;
  updatedAt: number;
}

export type CollegeSummary = Pick<
  College,
  | "id"
  | "name"
  | "slug"
  | "city"
  | "state"
  | "location"
  | "type"
  | "established"
  | "feesPerYear"
  | "rating"
  | "reviewCount"
  | "logoUrl"
  | "imageUrl"
  | "streams"
  | "nirfRank"
>;

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  degree: string; // e.g. "B.Tech", "MBA", "MBBS"
  durationYears: number;
  feesPerYear: number;
  seats: number;
  eligibility: string;
}

export interface PlacementYear {
  id: string;
  collegeId: string;
  year: number;
  avgPackageLPA: number;
  medianPackageLPA: number;
  highestPackageLPA: number;
  placementPercentage: number;
  topRecruiters: string[];
}

export interface Review {
  id: string;
  collegeId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  course?: string;
  batchYear?: number;
  verifiedStudent?: boolean;
  helpfulCount?: number;
  createdAt: number;
}

export type ExamType = "JEE Main" | "JEE Advanced" | "NEET" | "CAT";
export type StudentCategory = "General" | "OBC" | "SC" | "ST" | "EWS";

export interface PredictorCutoff {
  id: string;
  collegeId: string;
  exam: ExamType;
  category: StudentCategory;
  year: number;
  closingRank: number;
  course: string;
}

export interface PredictionResult {
  cutoff: PredictorCutoff;
  college: CollegeSummary;
  bucket: "safe" | "moderate" | "ambitious";
  probabilityScore: number;
  marginText: string;
}

export interface SavedComparison {
  id: string;
  title?: string;
  collegeIds: string[];
  createdAt: number;
}

export interface SavedItems {
  sessionId: string;
  savedColleges: string[];
  savedComparisons: SavedComparison[];
  updatedAt: number;
}

export interface NormalizedComparisonCollege {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  established: number;
  feesPerYear: number;
  rating: number;
  reviewCount: number;
  logoUrl: string;
  imageUrl?: string;
  nirfRank?: number;
  streams: string[];
  latestPlacement: PlacementYear | null;
  coursesCount: number;
  topCourses: string[];
  website?: string;
}

// Zod validation schemas
export const CollegeQuerySchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(["Government", "Private", "Deemed"]).optional(),
  stream: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "name_asc"]).default("rating_desc"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12),
});
export const collegeQuerySchema = CollegeQuerySchema;

export const CompareRequestSchema = z.object({
  collegeIds: z.array(z.string().min(1)).min(2, "Select at least 2 colleges to compare").max(3, "Maximum 3 colleges can be compared"),
});
export const compareRequestSchema = CompareRequestSchema;

export const PredictorRequestSchema = z.object({
  exam: z.enum(["JEE Main", "JEE Advanced", "NEET", "CAT"]),
  rank: z.coerce.number().int().positive("Rank must be a positive integer"),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"]),
  year: z.coerce.number().int().optional(),
});
export const predictorRequestSchema = PredictorRequestSchema;

export const SaveCollegeRequestSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});
export const saveCollegeRequestSchema = SaveCollegeRequestSchema;

export const SaveComparisonRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  collegeIds: z.array(z.string()).min(2, "Minimum 2 colleges").max(3, "Maximum 3 colleges"),
});
export const saveComparisonRequestSchema = SaveComparisonRequestSchema;

export const SaveItemSchema = z.object({
  type: z.enum(["college", "comparison"]),
  collegeId: z.string().optional(),
  comparison: z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    collegeIds: z.array(z.string()).min(2).max(3),
  }).optional(),
});

export const DeleteSavedItemSchema = z.object({
  type: z.enum(["college", "comparison"]),
  collegeId: z.string().optional(),
  comparisonId: z.string().optional(),
});

export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
    code: string;
    details?: any;
  } | null;
}
