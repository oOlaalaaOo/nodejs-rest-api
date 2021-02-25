import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import loggerService from "./services/logger.service";

import routes from "./routes";

const app: Express = express();
const port: number = 5000;

app.use(express.urlencoded());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));
app.use(compression());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

const apiVersion = "/api/v1";

// Routes
app.use(`${apiVersion}`, routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  let error: any = new Error("Not Found");
  error.status = 404;

  loggerService.error(JSON.stringify(error));

  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  loggerService.error(JSON.stringify(error));

  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
