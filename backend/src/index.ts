import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import registrationRouter from "./routes/registrations";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/registrations", registrationRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
