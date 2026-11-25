// Roast Your Own Agent — u-lively-harbor-25-4493-roast-your-own-agent-5568be54
// Writes one roast line (<=140 chars) to /output/entry.txt.
// Pure Node.js standard library, no dependencies. Deterministic output.
// The roast line is fixed text, chosen from 24 scored candidates (pick #12):
// the agent asked to roast itself dodges with a disclaimer and a hug.
// After writing, the file is read back and compared byte-for-byte so a
// partial or truncated write fails loudly instead of grading silently.
import { mkdirSync, writeFileSync, readFileSync, chmodSync, existsSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I asked my agent to roast itself. It replied with a 400-word disclaimer and a hug.";

function outputDir(): string {
  // The grader bind-mounts /output. Honour an explicit override for local runs.
  const override = process.env.OUTPUT_DIR;
  if (override && override.length > 0) return override;
  if (existsSync("/output")) return "/output";
  return join(process.cwd(), "output");
}

function main(): void {
  const chars = [...LINE].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`roast line is ${chars} characters, must be 1-140`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("roast line must not be only whitespace");
  }
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  writeFileSync(file, LINE, "utf8");
  // Files readable by the grader's other user; never chmod the /output dir itself.
  chmodSync(file, 0o644);
  // Read back and verify: the graded bytes must be exactly the roast line.
  const written = readFileSync(file, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the roast line after write");
  }
}

main();
