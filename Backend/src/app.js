import express from "express";
import handleError from "./middlewares/error.middleware.js";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// import router
import authRouter from "./routes/auth.routes.js";

// use router
app.use("/api/auth", authRouter);

// error middleware at last
app.use(handleError);

export default app;
