import "dotenv/config";
import cors from "cors";
import express from "express";
import adminRouter from "./routes/admin";
import registrationRouter from "./routes/registrations";
import contactRouter from "./routes/contact";

const app = express();
const port = Number(process.env.PORT || 4000);

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}

function withWwwVariant(origin: string) {
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();

    if (host.startsWith("www.")) {
      return `${url.protocol}//${host.replace(/^www\./, "")}${url.port ? `:${url.port}` : ""}`;
    }

    return `${url.protocol}//www.${host}${url.port ? `:${url.port}` : ""}`;
  } catch {
    return "";
  }
}

const corsOriginSource =
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000";
const configuredOrigins = corsOriginSource
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

for (const origin of configuredOrigins) {
  const variant = withWwwVariant(origin);
  if (variant) {
    allowedOrigins.add(normalizeOrigin(variant));
  }
}

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Requests from Postman or server-side scripts may not include an Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalized = normalizeOrigin(origin);

    if (allowedOrigins.has("*") || allowedOrigins.has(normalized)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
