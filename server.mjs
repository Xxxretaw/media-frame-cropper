import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function safePath(urlPath){
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const requested = clean === "/" ? "/index.html" : clean;
  const full = resolve(root, "." + normalize(requested));
  if(!full.startsWith(root)) return null;
  return full;
}

createServer((req, res) => {
  const file = safePath(req.url || "/");
  const target = file && existsSync(file) ? file : join(root, "index.html");
  let stat;
  try{
    stat = statSync(target);
  }catch{
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  if(stat.isDirectory()){
    res.writeHead(301, { Location: "/" });
    res.end();
    return;
  }
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Cache-Control", target.includes(`${join("vendor","ffmpeg")}`) ? "public, max-age=31536000, immutable" : "no-cache");
  res.setHeader("Content-Type", types[extname(target).toLowerCase()] || "application/octet-stream");
  createReadStream(target).pipe(res);
}).listen(port, () => {
  console.log(`Local preview: http://localhost:${port}`);
  console.log("COOP/COEP headers enabled for FFmpeg.wasm multi-thread mode.");
});
