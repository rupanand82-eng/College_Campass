import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbStore } from "./server/db";
import { getSessionIdentity } from "./lib/session";
import {
  collegeQuerySchema,
  compareRequestSchema,
  predictorRequestSchema,
  saveCollegeRequestSchema,
  saveComparisonRequestSchema,
} from "./src/types";

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ data: { status: "ok", timestamp: Date.now() }, error: null });
  });

  // Filter Metadata
  app.get("/api/colleges/meta/filters", (_req: Request, res: Response) => {
    try {
      const meta = dbStore.getFiltersMetadata();
      res.json({ data: meta, error: null });
    } catch (err: any) {
      res.status(500).json({ data: null, error: { message: err.message || "Failed to load metadata" } });
    }
  });

  // 1. GET /api/colleges (List + Filter + Search + Cursor Pagination)
  app.get("/api/colleges", (req: Request, res: Response) => {
    try {
      const validation = collegeQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Invalid query parameters",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten(),
          },
        });
      }

      const result = dbStore.getColleges(validation.data);
      return res.json({ data: result, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching colleges" },
      });
    }
  });

  // 2. GET /api/colleges/:slug (Full Details + Courses + 2yr Placements + Reviews p1)
  app.get("/api/colleges/:slug", (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const data = dbStore.getCollegeBySlug(slug);

      if (!data) {
        return res.status(404).json({
          data: null,
          error: { message: `College with identifier "${slug}" not found`, code: "NOT_FOUND" },
        });
      }

      return res.json({ data, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching college details" },
      });
    }
  });

  // 3. GET /api/colleges/:slug/reviews (Paginated reviews)
  app.get("/api/colleges/:slug/reviews", (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = dbStore.getCollegeReviews(slug, { cursor, limit });
      if (!result) {
        return res.status(404).json({
          data: null,
          error: { message: `College with identifier "${slug}" not found`, code: "NOT_FOUND" },
        });
      }

      return res.json({ data: result, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching reviews" },
      });
    }
  });

  // 4. POST /api/compare (Normalized Side-by-Side Comparison for 2-3 Colleges)
  app.post("/api/compare", (req: Request, res: Response) => {
    try {
      const validation = compareRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Must provide between 2 and 3 valid college IDs to compare",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten(),
          },
        });
      }

      const comparison = dbStore.compareColleges(validation.data.collegeIds);
      return res.json({ data: comparison, error: null });
    } catch (err: any) {
      return res.status(err.message.includes("not found") ? 404 : 500).json({
        data: null,
        error: { message: err.message || "Error comparing colleges" },
      });
    }
  });

  // 5. POST /api/predictor (Rank Cutoff Matching into Safe, Moderate, Ambitious)
  app.post("/api/predictor", (req: Request, res: Response) => {
    try {
      const validation = predictorRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Invalid predictor inputs. Please verify exam, rank, and category.",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten(),
          },
        });
      }

      const prediction = dbStore.predictColleges(validation.data);
      return res.json({ data: prediction, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error generating admission predictions" },
      });
    }
  });

  // 6. GET /api/saved (Get saved colleges and comparisons for session)
  app.get("/api/saved", (req: Request, res: Response) => {
    try {
      const session = getSessionIdentity(req, res);
      const saved = dbStore.getSavedItems(session.sessionId);

      // Hydrate saved colleges into CollegeSummary objects
      const collegeSummaries = saved.savedColleges
        .map((cid) => {
          const detail = dbStore.getCollegeBySlug(cid);
          if (!detail) return null;
          const { college } = detail;
          return {
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
        })
        .filter(Boolean);

      return res.json({
        data: {
          sessionId: session.sessionId,
          savedColleges: collegeSummaries,
          savedCollegeIds: saved.savedColleges,
          savedComparisons: saved.savedComparisons,
        },
        error: null,
      });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error fetching saved items" },
      });
    }
  });

  // 7. POST /api/saved/colleges (Save a college)
  app.post("/api/saved/colleges", (req: Request, res: Response) => {
    try {
      const validation = saveCollegeRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: { message: "Invalid college ID", code: "VALIDATION_ERROR" },
        });
      }

      const session = getSessionIdentity(req, res);
      const updated = dbStore.saveCollege(session.sessionId, validation.data.collegeId);
      return res.json({ data: updated, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error saving college" },
      });
    }
  });

  // 8. DELETE /api/saved/colleges/:collegeId (Remove a saved college)
  app.delete("/api/saved/colleges/:collegeId", (req: Request, res: Response) => {
    try {
      const { collegeId } = req.params;
      const session = getSessionIdentity(req, res);
      const updated = dbStore.removeSavedCollege(session.sessionId, collegeId);
      return res.json({ data: updated, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error removing saved college" },
      });
    }
  });

  // 9. POST /api/saved/comparisons (Save a 2-3 college comparison set)
  app.post("/api/saved/comparisons", (req: Request, res: Response) => {
    try {
      const validation = saveComparisonRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: { message: "Comparison must have 2 to 3 valid college IDs", code: "VALIDATION_ERROR" },
        });
      }

      const session = getSessionIdentity(req, res);
      const updated = dbStore.saveComparison(session.sessionId, validation.data);
      return res.json({ data: updated, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error saving comparison" },
      });
    }
  });

  // 10. DELETE /api/saved/comparisons/:id (Delete saved comparison)
  app.delete("/api/saved/comparisons/:id", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const session = getSessionIdentity(req, res);
      const updated = dbStore.removeSavedComparison(session.sessionId, id);
      return res.json({ data: updated, error: null });
    } catch (err: any) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error deleting comparison" },
      });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CollegeCompass production server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
