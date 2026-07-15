#!/usr/bin/env node
// Regenerates src/design/icons/icon-registry.tsx from whatever .svg files
// exist in src/design/icons/svgs/ — Metro has no require.context()/dynamic
// require by filename, so every icon needs a real static import. Re-run
// this whenever icons are added/removed/renamed.
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

const entries = files.map((file) => {
  const name = file.replace(/\.svg$/, "");
  return { name, identifier: toIdentifier(name), file };
});

const imports = entries.map((e) => `import ${e.identifier} from "./svgs/${e.file}";`).join("\n");
const mapEntries = entries.map((e) => `  "${e.name}": ${e.identifier},`).join("\n");
const names = entries.map((e) => `"${e.name}"`).join(" | ");

const content = `// GENERATED FILE — do not hand-edit.
// Regenerate with: node scripts/generate-icon-registry.js
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

${imports}

export const ICON_REGISTRY: Record<string, FC<SvgProps>> = {
${mapEntries}
};

export type IconName = ${names};
`;

fs.writeFileSync(outFile, content);
console.log("Wrote " + entries.length + " icons to " + path.relative(process.cwd(), outFile));
