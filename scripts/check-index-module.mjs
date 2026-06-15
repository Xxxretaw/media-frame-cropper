import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const html = readFileSync("index.html", "utf8");
const match = html.match(/<script type="module">([\s\S]*)<\/script>/);

if(!match){
  console.error("module script not found in index.html");
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "cropper-check-"));
const file = join(dir, "index-module.mjs");

try{
  writeFileSync(file, match[1], "utf8");
  const result = spawnSync(process.execPath, ["--check", file], { stdio:"inherit" });
  process.exitCode = result.status || 0;
}finally{
  rmSync(dir, { recursive:true, force:true });
}
