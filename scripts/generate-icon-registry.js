#!/usr/bin/env node
// Regenerates src/design/icons/icon-registry.tsx from whatever .svg files
// exist in src/design/icons/svgs/ — Metro has no require.context()/dynamic
// require by filename, so every icon needs a real static import. Re-run
// this whenever icons are added/removed/renamed.
//
// Also emits ICON_VIEWBOX (name -> natural {width,height}) read from each
// file's own viewBox attribute at generation time. The web app's
// naturalGlyphSize() regexes this out of the raw SVG string at render
// time, but RN's .svg imports are already-compiled components by the time
// they reach app code — there's no string left to parse — so the natural
// size has to be captured once, here, instead.
const fs = require("fs");
const path = require("path");

const svgsDir = path.join(__dirname, "..", "src", "design", "icons", "svgs");
const outFile = path.join(__dirname, "..", "src", "design", "icons", "icon-registry.tsx");

const files = fs
  .readdirSync(svgsDir)
  .filter((f) => f.endsWith(".svg"))
  .sort();

function toIdentifier(name) {
  // "18-fill" -> "Icon18Fill", "chevron-up" -> "ChevronUp"
  const camel = name
    .split(/[-.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return /^[0-9]/.test(camel) ? `Icon${camel}` : camel;
}

function readViewBox(file) {
  const src = fs.readFileSync(path.join(svgsDir, file), "utf8");
  const match = src.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
  if (!match) return { width: 24, height: 24 };
  return { width: parseFloat(match[1]), height: parseFloat(match[2]) };
}

const entries = files.map((file) => {
  const name = file.replace(/\.svg$/, "");
  return { name, identifier: toIdentifier(name), file, viewBox: readViewBox(file) };
});

const imports = entries.map((e) => `import ${e.identifier} from "./svgs/${e.file}";`).join("\n");
const mapEntries = entries.map((e) => `  "${e.name}": ${e.identifier},`).join("\n");
const viewBoxEntries = entries.map((e) => `  "${e.name}": { width: ${e.viewBox.width}, height: ${e.viewBox.height} },`).join("\n");
const names = entries.map((e) => `"${e.name}"`).join(" | ");

const content = `// GENERATED FILE — do not hand-edit.
// Regenerate with: node scripts/generate-icon-registry.js
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

${imports}

export const ICON_REGISTRY: Record<string, FC<SvgProps>> = {
${mapEntries}
};

export const ICON_VIEWBOX: Record<string, { width: number; height: number }> = {
${viewBoxEntries}
};

export type IconName = ${names};
`;

fs.writeFileSync(outFile, content);
console.log("Wrote " + entries.length + " icons to " + path.relative(process.cwd(), outFile));
