import "dotenv/config";
import cors from "cors";
import express from "express";
import adminRouter from "./routes/admin";
import registrationRouter from "./routes/registrations";
import contactRouter from "./routes/contact";

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOriginSource =
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000";
const allowedOrigins = corsOriginSource
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests from Postman or server-side scripts may not include an Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin", adminRouter);
app.use("/api/registrations", registrationRouter);
app.use("/api/contact", contactRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
