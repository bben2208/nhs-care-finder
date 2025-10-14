import { RequestHandler } from "express";

// accept anything; keep interface compatible
export function validate(): RequestHandler {
  return (_req, _res, next) => next();
}