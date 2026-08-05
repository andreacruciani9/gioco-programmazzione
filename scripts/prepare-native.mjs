import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const webDir = resolve(root, "www");
const files = [
  "index.html","styles.css","app.js","native-bridge.js","exercises.json",
  "manifest.json","sw.js","icon.svg","config.js","version.json","privacy-policy.html","support.html"
];

await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });
for (const file of files) await cp(resolve(root,file), resolve(webDir,file));
console.log(`CodeForge web assets copiati in ${webDir}`);
