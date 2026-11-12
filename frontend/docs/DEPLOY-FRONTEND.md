# Deploying the frontend (static export → Heberjahiz Windows Plesk / IIS)

## Build
1. In `frontend/`, run `pnpm build` on the usual Windows machine.
2. `postbuild` runs `scripts/flatten-export.mjs` automatically. It flattens the
   Next.js page-data files (`__next.*.txt`) and verifies them. The build fails if
   any file is missing or if `out/web.config` is absent. Expect it to print
   `files moved: N` and `files verified: N`.

## Upload
3. Upload the **contents** of `out/` (not the `out` folder itself) into `httpdocs`.
   `out/web.config` comes from `public/web.config` and replaces the server's copy:
   put any server-side setting in `public/web.config` first. IIS ignores `.htaccess`.
4. Never delete the existing `_next/static/` on the server when uploading. Browsers
   with an older page still open load chunks from the previous build.

Note: there is no URL rewrite. The flatten step is what makes page-data URLs work.

## Check after deploy
5. `curl -I https://welearn.ma/contact/__next.contact.__PAGE__.txt` must return `200`
   with `Content-Type: text/plain`.
6. Open a few pages and click between them. The browser console must show no
   `__next.*.txt` 404s. An unknown URL must show the site's 404 page.
7. If the whole site returns a 500, rename `web.config` on the server and reload.
   If that fixes it, the host has locked one of its sections; report which one.
