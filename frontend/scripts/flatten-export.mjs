// Postbuild step for the static export (output: "export").
//
// Next.js 16 static export bug on Windows (vercel/next.js#85374, #92339):
// segment page-data files are written nested, e.g.
//   out/contact/__next.contact/__PAGE__.txt
// while the client router requests the flat name
//   out/contact/__next.contact.__PAGE__.txt
// This script moves nested files to their flat names, removes the emptied
// __next.* directories, then verifies every page-data URL the client can
// request exists as a flat file in out/. On Linux/macOS builds nothing is
// nested, so it only verifies.
//
// Exit 1 on: a flat file that already exists (never overwritten), any
// requested page-data file missing, any __next.* directory left, or a
// missing out/.htaccess.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const frontendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(frontendDir, "out");
const appServerDir = path.join(frontendDir, ".next", "server", "app");

// Same naming function the client router uses (segment-cache/cache.js).
const require = createRequire(path.join(frontendDir, "package.json"));
const { convertSegmentPathToStaticExportFilename } = require(
  "next/dist/shared/lib/segment-cache/segment-value-encoding.js",
);

const SEGMENT_DIR_PREFIX = "__next.";
const SEGMENT_SUFFIX = ".segment.rsc";
const TXT = ".txt";

function fail(message) {
  console.error(`[flatten-export] ERROR: ${message}`);
  process.exit(1);
}

function listFilesRecursive(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else files.push(full);
  }
  return files;
}

// Top-level nested segment directories: out/**/__next.<name>/ (not descended into).
function findSegmentDirs(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith(SEGMENT_DIR_PREFIX)) found.push(full);
    else found.push(...findSegmentDirs(full));
  }
  return found;
}

function removeEmptyDirs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(path.join(dir, entry.name));
  }
  fs.rmdirSync(dir); // throws if not empty: nothing is ever deleted recursively
}

if (!fs.existsSync(outDir)) fail(`${outDir} not found (is output: "export" set?)`);
if (!fs.existsSync(appServerDir)) fail(`${appServerDir} not found`);

// 1. Plan every move first; abort before touching anything on a collision.
const segmentDirs = findSegmentDirs(outDir);
const moves = [];
const destinations = new Set();
for (const segDir of segmentDirs) {
  const parent = path.dirname(segDir);
  const rootName = path.basename(segDir).slice(SEGMENT_DIR_PREFIX.length);
  for (const file of listFilesRecursive(segDir)) {
    if (!file.endsWith(TXT)) fail(`unexpected non-.txt file in segment dir: ${file}`);
    const parts = path.relative(segDir, file).split(path.sep);
    parts[parts.length - 1] = parts[parts.length - 1].slice(0, -TXT.length);
    const segmentPath = "/" + [rootName, ...parts].join("/");
    const dest = path.join(parent, convertSegmentPathToStaticExportFilename(segmentPath));
    if (fs.existsSync(dest)) fail(`flat file already exists, not overwriting: ${dest}`);
    if (destinations.has(dest)) fail(`two nested files map to the same flat name: ${dest}`);
    destinations.add(dest);
    moves.push({ from: file, to: dest });
  }
}

// 2. Move, then remove the emptied __next.* directories.
for (const { from, to } of moves) fs.renameSync(from, to);
for (const segDir of segmentDirs) removeEmptyDirs(segDir);

// 3. Verify every page-data URL the client can request, from the build's
//    segment manifest (.next/server/app/**/<route>.segments/).
const missing = [];
const skippedRoutes = [];
let verified = 0;
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (!entry.name.endsWith(".segments")) {
      walk(full);
      continue;
    }
    const routeRel = path
      .relative(appServerDir, full)
      .split(path.sep)
      .join("/")
      .slice(0, -".segments".length);
    const route = routeRel === "index" ? "" : routeRel;
    const routeOutDir = path.join(outDir, ...route.split("/").filter(Boolean));
    if (!fs.existsSync(path.join(routeOutDir, "index.html"))) {
      skippedRoutes.push("/" + route); // not an exported page (e.g. /_global-error)
      continue;
    }
    for (const file of listFilesRecursive(full)) {
      if (!file.endsWith(SEGMENT_SUFFIX)) continue;
      const segmentPath =
        "/" + path.relative(full, file).split(path.sep).join("/").slice(0, -SEGMENT_SUFFIX.length);
      const flat = path.join(routeOutDir, convertSegmentPathToStaticExportFilename(segmentPath));
      if (fs.existsSync(flat) && fs.statSync(flat).isFile()) verified++;
      else missing.push(path.relative(outDir, flat).split(path.sep).join("/"));
    }
  }
})(appServerDir);

const leftoverDirs = findSegmentDirs(outDir);

console.log(`[flatten-export] files moved: ${moves.length}`);
console.log(`[flatten-export] files verified: ${verified}`);
if (skippedRoutes.length) {
  console.log(`[flatten-export] skipped (not exported): ${skippedRoutes.join(", ")}`);
}

if (missing.length) {
  missing.slice(0, 20).forEach((m) => console.error(`  missing: out/${m}`));
  fail(`${missing.length} requested page-data file(s) missing as flat files`);
}
if (leftoverDirs.length) fail(`__next.* directories left in out/: ${leftoverDirs.join(", ")}`);
if (verified === 0) fail("no page-data files verified");
if (!fs.existsSync(path.join(outDir, ".htaccess"))) {
  fail("out/.htaccess is missing (expected from public/.htaccess)");
}
