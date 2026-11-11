# Deploying the frontend (static export → Heberjahiz Plesk)

## Build
1. In `frontend/`, run `pnpm build` on the usual Windows machine.
2. `postbuild` runs `scripts/flatten-export.mjs` automatically. It flattens the
   Next.js page-data files (`__next.*.txt`) and verifies them. The build fails if
   any file is missing or if `out/.htaccess` is absent. Expect it to print
   `files moved: N` and `files verified: N`.

## Upload
3. Upload the **contents** of `out/` (not the `out` folder itself) into `httpdocs`.
   Include dotfiles: `out/.htaccess` comes from `public/.htaccess` and replaces the
   server's copy. Put any server-side directive in `public/.htaccess` first.
   In Plesk File Manager, turn on "show hidden files" to confirm `.htaccess` is there.
4. Never delete the existing `_next/static/` on the server when uploading. Browsers
   with an older page still open load chunks from the previous build.

Note: if nginx serves static files directly on Plesk, the page-data files go
straight from disk and Apache's `.htaccess` never runs for them. The flatten step
is what makes them work. The `.htaccess` rewrite is only a fallback.

## Check after deploy
5. `curl -I https://welearn.ma/contact/__next.contact.__PAGE__.txt` must return `200`.
6. Open a few pages and click between them. The browser console must show no
   `__next.*.txt` 404s.
