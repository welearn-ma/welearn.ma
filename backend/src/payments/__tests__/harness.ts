import cors from "cors";
import express, { type Router } from "express";
import { once } from "events";
import http from "http";
import type { AddressInfo } from "net";
import type { CmiConfig } from "../../config/cmi";
import { computeReceivedHash, decodeHtmlEntities } from "../cmi";

/**
 * Harnais HTTP des tests : routeurs montes comme dans index.ts (paiements
 * AVANT un cors() global strict + express.json(), le reste apres).
 */

export const KEY = "TEST_ONLY_KEY";
export const SITE = "https://site.example.test";
export const API = "https://api.example.test";
export const GATEWAY = "https://gateway.example.test/fim/est3Dgate";
export const CONFIG: CmiConfig = {
  clientId: "TESTCLIENT01",
  storeKey: KEY,
  gatewayUrl: GATEWAY,
  apiPublicUrl: API,
  siteUrl: SITE,
};

export interface HttpResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

export interface TestServer {
  base: string;
  close(): Promise<void>;
}

export async function startServer(mounts: {
  payments?: Router;
  afterCors?: Array<[string, Router]>;
}): Promise<TestServer> {
  const app = express();
  if (mounts.payments) {
    app.use("/api/payments", mounts.payments);
  }
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === SITE) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin not allowed by CORS"));
      },
    }),
  );
  app.use(express.json());
  for (const [path, router] of mounts.afterCors ?? []) {
    app.use(path, router);
  }

  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    base: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

export function request(
  base: string,
  method: string,
  path: string,
  options: {
    form?: Record<string, string>;
    json?: unknown;
    raw?: { body: Buffer; contentType: string };
    headers?: Record<string, string>;
  } = {},
): Promise<HttpResult> {
  const headers: Record<string, string> = { ...options.headers };
  let payload: string | Buffer | undefined;

  if (options.form) {
    payload = new URLSearchParams(options.form).toString();
    headers["content-type"] = "application/x-www-form-urlencoded";
  } else if (options.json !== undefined) {
    payload = JSON.stringify(options.json);
    headers["content-type"] = "application/json";
  } else if (options.raw) {
    payload = options.raw.body;
    headers["content-type"] = options.raw.contentType;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(new URL(path, base), { method, headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk: string) => {
        body += chunk;
      });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    if (payload !== undefined) {
      req.write(payload);
    }
    req.end();
  });
}

export function parseGatewayForm(html: string) {
  const fields = [...html.matchAll(/<input type="hidden" name="([^"]*)" value="([^"]*)">/g)].map(
    (match): [string, string] => [decodeHtmlEntities(match[1]), decodeHtmlEntities(match[2])],
  );
  return Object.fromEntries(fields) as Record<string, string>;
}

/** Corps de callback CMI signe avec la cle factice. */
export function cmiBody(
  posted: Record<string, string>,
  extra: Record<string, string>,
): Record<string, string> {
  const { HASH: _sentHash, ...echoed } = posted;
  const body = { ...echoed, ...extra };
  return { ...body, HASH: computeReceivedHash(body, KEY) };
}

/** Corps multipart/form-data construit a la main (champs + 1 fichier). */
export function multipart(
  fields: Record<string, string>,
  file?: { field?: string; name: string; type: string; bytes: Buffer },
): { body: Buffer; contentType: string } {
  const boundary = "----welearntestboundary7MA4YWxkTrZu0gW";
  const parts: Buffer[] = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
        "utf8",
      ),
    );
  }
  if (file) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${file.field ?? "file"}"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`,
        "utf8",
      ),
      file.bytes,
      Buffer.from("\r\n", "utf8"),
    );
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`, "utf8"));
  return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` };
}
