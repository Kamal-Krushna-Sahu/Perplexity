import express from "express";
import handleError from "./middlewares/error.middleware.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// import router
import authRouter from "./routes/auth.routes.js";

// use router
app.use("/api/auth", authRouter);

// error middleware at last
app.use(handleError);

export default app;
