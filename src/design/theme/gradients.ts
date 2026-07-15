/*
  Ported from tokens.css's linear-gradient() custom properties. RN has no
  CSS gradient syntax — these render via expo-linear-gradient's
  <LinearGradient colors={...} start={...} end={...} />. CSS angle ->
  start/end point conversion: for angle θ (CSS convention, 0deg = up,
  clockwise), direction vector = (sin θ, -cos θ); start = center - v/2,
  end = center + v/2, in normalized 0..1 space. Verified against the
  well-known 135deg-is-diagonal reference case (start (0.146,0.146), end
  (0.854,0.854) — top-left to bottom-right, exactly as expected) before
  trusting it for the rest.

  Approximate, not pixel-exact vs the CSS rendering (CSS's actual gradient
  line length is computed from the box's aspect ratio + corner geometry,
  not a simple 0..1 vector) — close enough for a first RN pass; revisit
  against a real device screenshot if a gradient looks visibly off.
*/
export type GradientSpec = {
  colors: [string, string, ...string[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations?: [number, number, ...number[]];
};

export const gradients: Record<string, GradientSpec> = {
  // Button primary/level2 — 19deg, cyan
  buttonPrimaryLevel2: {
    colors: ["rgb(1, 217, 255)", "rgb(49, 241, 240)"],
    start: { x: 0.337, y: 0.973 },
    end: { x: 0.663, y: 0.027 },
    locations: [0.25, 0.75],
  },
  // Button primary/level3 — 161deg, orange
  buttonPrimaryLevel3: {
    colors: ["#FD4B03", "#FF9800"],
    start: { x: 0.337, y: 0.027 },
    end: { x: 0.663, y: 0.973 },
  },
  // Control/On (Switch/Radio/Checkbox active state) — 135deg, orange
  controlOn: {
    colors: ["#FD4B03", "#FF9800"],
    start: { x: 0.146, y: 0.146 },
    end: { x: 0.854, y: 0.854 },
  },
  // Condition/Info (Snackbar/Infoblock) — 172deg, violet -> cyan
  conditionInfo: {
    colors: ["#973BFF", "#01D9FF"],
    start: { x: 0.43, y: 0.005 },
    end: { x: 0.57, y: 0.995 },
  },
  // Condition/Success — 172deg, green
  conditionSuccess: {
    colors: ["#25A402", "#00DC51"],
    start: { x: 0.43, y: 0.005 },
    end: { x: 0.57, y: 0.995 },
    locations: [0.0478, 1],
  },
  // Condition/Negative — 172deg, pink -> red
  conditionNegative: {
    colors: ["#FF019E", "#F3025F"],
    start: { x: 0.43, y: 0.005 },
    end: { x: 0.57, y: 0.995 },
  },
  // Button glass stroke — 135deg, variable-opacity white (bright at the
  // top-left/bottom-right ends, faint through the middle). Used as a
  // gradient BORDER (outer LinearGradient wrapper + inset solid fill),
  // not a background fill — see components/primitives/Button.tsx.
  buttonGlassStroke: {
    colors: [
      "rgba(255, 255, 255, 0.38)",
      "rgba(255, 255, 255, 0.05)",
      "rgba(255, 255, 255, 0.05)",
      "rgba(255, 255, 255, 0.30)",
    ],
    start: { x: 0.146, y: 0.146 },
    end: { x: 0.854, y: 0.854 },
    locations: [0, 0.34, 0.64, 1],
  },
};
