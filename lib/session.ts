import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const SESSION_COOKIE_NAME = "cc_session_id";

export interface SessionIdentity {
  sessionId: string;
  isAnonymous: boolean;
  userId?: string;
  email?: string;
}

/**
 * Single seam for identity resolution across all saved-item routes and user-specific actions.
 * 
 * In this MVP cut, we resolve identity using a persistent, cryptographically secure anonymous
 * session UUID stored in a signed/secure cookie.
 * 
 * UPGRADE SEAM TO FIREBASE AUTH:
 * When migrating to full Firebase Authentication, replace the body of `getSessionIdentity` with:
 * ```ts
 * const authHeader = req.headers.authorization;
 * if (authHeader?.startsWith('Bearer ')) {
 *   const idToken = authHeader.split('Bearer ')[1];
 *   const decodedToken = await admin.auth().verifyIdToken(idToken);
 *   return { sessionId: decodedToken.uid, isAnonymous: false, userId: decodedToken.uid, email: decodedToken.email };
 * }
 * ```
 * The rest of the application data model is already keyed on `sessionId` (or `userId`), so
 * zero database migration is needed.
 */
export function getSessionIdentity(req: Request, res?: Response): SessionIdentity {
  let sessionId = req.cookies?.[SESSION_COOKIE_NAME];

  if (!sessionId) {
    // Generate new anonymous device/session UUID
    sessionId = uuidv4();

    if (res) {
      // Set secure long-lived cookie (1 year expiration)
      res.cookie(SESSION_COOKIE_NAME, sessionId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  }

  return {
    sessionId,
    isAnonymous: true,
  };
}
