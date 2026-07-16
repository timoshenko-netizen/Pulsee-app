import { ICON_VIEWBOX } from "./icon-registry";
import type { IconName } from "./icon-registry";

/*
  RN equivalent of the web app's naturalGlyphSize (design/icons/rawSvg.ts):
  never upscale a glyph past its own natural size to fill a box, only
  shrink if it's larger — matches Figma's per-glyph container spec. The
  web version regexes the raw SVG string's viewBox at render time; RN's
  .svg imports are already-compiled components by the time app code sees
  them, so there's no string left to parse — the natural size is captured
  once at codegen time instead (see scripts/generate-icon-registry.js).
*/
export function naturalGlyphSize(name: IconName, box: number): { width: number; height: number } {
  const vb = ICON_VIEWBOX[name] ?? { width: box, height: box };
  const scale = Math.min(1, box / Math.max(vb.width, vb.height));
  return { width: vb.width * scale, height: vb.height * scale };
}
