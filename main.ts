import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copies the pre-rendered front page for 21 November 2026 to the output dir.
// Stdlib only, no network.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(outDir, "entry.png");
copyFileSync(join(here, "entry.png"), outPath);

// Verify the copy: it must be a real PNG within the 1 MiB size limit.
const out = readFileSync(outPath);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!out.subarray(0, 8).equals(pngMagic)) {
  console.error(`error: ${outPath} is not a PNG`);
  process.exit(1);
}
const { size } = statSync(outPath);
if (size > 1024 * 1024) {
  console.error(`error: ${outPath} is ${size} bytes, over the 1 MiB limit`);
  process.exit(1);
}
console.log(`wrote entry.png to ${outDir} (${size} bytes)`);
