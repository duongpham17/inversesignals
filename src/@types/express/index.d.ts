import "express";

declare global {
  namespace Express {
    interface Request {
      subdomain?: string | null;
    }
  }
}
