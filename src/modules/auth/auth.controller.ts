import { Request, Response, NextFunction } from "express";

const login = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Handling POST requests to /auth/login",
  });
};

export default {
  login,
};
