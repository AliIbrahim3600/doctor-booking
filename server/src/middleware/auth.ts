import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: any;
}

// Protect routes — verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
    return;
  }
};

// Restrict to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role)) {
      res.status(403).json({
        message: `Role '${req.user?.role}' is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
