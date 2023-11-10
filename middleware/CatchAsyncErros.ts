import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
export const CatchAsyncErrors =
  (theFunc:any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
