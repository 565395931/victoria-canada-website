const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.resolve(__dirname, "..", "public");
const textExtensions = new Set([".html", ".css", ".js"]);
const referencePattern = /(?:src|href)=["'](\.\/[^"'#?]+)|url\(["']?(\.\/[^"')?#]+)["']?\)/g;
const missing = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

for (const file of walk(publicDir)) {
  if (!textExtensions.has(path.extname(file))) continue;
  const contents = fs.readFileSync(file, "utf8");
  for (const match of contents.matchAll(referencePattern)) {
    const reference = match[1] || match[2];
    const target = path.resolve(path.dirname(file), decodeURI(reference));
    if (!fs.existsSync(target)) {
      missing.push(`${path.relative(publicDir, file)} -> ${reference}`);
    }
  }
}

if (missing.length) {
  console.error("Missing local assets:\n" + missing.join("\n"));
  process.exit(1);
}

console.log("Site check passed: all local asset references resolve.");
