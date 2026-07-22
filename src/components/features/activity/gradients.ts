import type { IconName } from "@/design/icons/Icon";
import type { DatingType } from "./types";

/*
  Activity-local gradients (defined in PulseeActivity.dc.html's :root, not in
  the shared token set). expo-linear-gradient specs: 135deg → top-left→
  bottom-right (start 0,0 / end 1,1); 90deg → left→right (start 0,.5 / end 1,.5).
*/
export type GradSpec = { colors: [string, string, ...string[]]; start: { x: number; y: number }; end: { x: number; y: number }; locations?: [number, number, ...number[]] };

const diag = (colors: [string, string, ...string[]]): GradSpec => ({ colors, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } });

export const ACT = {
  uniTertiary: diag(["#FD0058", "#FD4B03"]),
  brandArc: diag(["#01D9FF", "#31F1F0"]),
  commonPink: diag(["#FA05F1", "#FC69F7"]),
  glassPrimary: diag(["rgba(49,241,240,0.7)", "rgba(49,241,240,0.3)"]),
  glassSecondary: diag(["rgba(151,59,255,0.7)", "rgba(151,59,255,0.3)"]),
  chipStroke: { colors: ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.9)"] as [string, string, string], start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 }, locations: [0, 0.5, 1] as [number, number, number] },
} satisfies Record<string, GradSpec>;

/** Dating-cell config per like type: ring + corner badge, name pill, and optional cell background. */
export const DATING: Record<DatingType, { badgeIcon: IconName; ring: GradSpec; pill: GradSpec; cell: GradSpec | null }> = {
  liked: { badgeIcon: "heart-fill", ring: ACT.uniTertiary, pill: ACT.glassSecondary, cell: null },
  super: { badgeIcon: "star-fill", ring: ACT.brandArc, pill: ACT.glassPrimary, cell: ACT.glassPrimary },
  match: { badgeIcon: "heart-double", ring: ACT.commonPink, pill: ACT.commonPink, cell: null },
};
