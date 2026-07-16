import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();



app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "Proyecto Mentorías",
    version: "1.0.0",
    status: "API Running"
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;