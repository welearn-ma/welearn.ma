import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import adminRouter from "./routes/admin";
import registrationRouter from "./routes/registrations";
import contactRouter from "./routes/contact";

const app = express();
const port = Number(process.env.PORT || 4000);

// Let AutoSSL / Let's Encrypt DCV files be served directly.
app.use(
  "/.well-known",
  express.static(path.join(process.cwd(), ".well-known")),
);

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

// Build list of allowed origins with FRONTEND_URL as primary and fallbacks
const frontendUrl = process.env.FRONTEND_URL || "https://welearn.ma";
const corsOriginSource = process.env.CORS_ORIGIN || frontendUrl;

// Combine CORS_ORIGIN (if set) with fallback values
const originsList = [
  ...corsOriginSource.split(",").map((o) => o.trim()),
  "https://welearn.ma",
  "https://www.welearn.ma",
  "http://localhost:3000",
];

const configuredOrigins = originsList
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// Remove duplicates
const allowedOrigins = new Set(configuredOrigins);

// Add www variants for all origins
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
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-JSON-Response-Size"],
  optionsSuccessStatus: 200,
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
