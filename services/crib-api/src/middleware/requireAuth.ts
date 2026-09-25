import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, UserRole } from "@toolvillage/types";
import "cookie-parser";

declare global {
      // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      data: null,
      error: {
        message: "Unauthorized: No token provided",
        code: "NO_TOKEN",
      },
    });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;

    return next();
  } catch (error) {
    console.error("[requireAuth] Token verification failed:", error);

    res.clearCookie("token", { path: "/" });

    return res.status(401).json({
      data: null,
      error: {
        message: "Unauthorized: Invalid or expired token",
        code: "BAD_TOKEN",
      },
    });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        data: null,
        error: {
          message: "Unauthorized: No user session",
          code: "NO_SESSION",
        },
      });
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        data: null,
        error: {
          message: "Forbidden: Insufficient permissions",
          code: "INSUFFICIENT_ROLE",
        },
      });
    }

    return next();
  };
}

export function restrictSuspended(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      data: null,
      error: {
        message: "Unauthorized",
        code: "NO_SESSION",
      },
    });
  }

  if (req.user.accountStatus === "suspended") {
    return res.status(403).json({
      data: null,
      error: {
        message: "Action Forbidden: Your account is currently suspended.",
        code: "ACCOUNT_SUSPENDED",
      },
    });
  }

  return next();
}

export const requireAdmin = requireRole("admin");