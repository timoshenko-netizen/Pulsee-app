/*
  Ported from starter/src/design/tokens.css (Figma "Colors Pulse", via
  Dev Mode MCP get_variable_defs). Flat solid colors only — gradients
  live in gradients.ts since RN has no CSS gradient syntax; they're
  rendered via expo-linear-gradient's <LinearGradient> instead.
*/
export const colors = {
  text: {
    primary: "#FFFFFF",
    secondary: "#B9B9B9",
    disabled: "#757C8A",
    inverted: "#000000",
    negative: "#FD0058",
    interactive1: "#31F1F0",
    interactive2: "#FD4B03",
    interactive3: "#FD4B03",
  },
  bg: {
    primary: "#080A0B",
    secondary: "#212323",
    cardLight: "#FFFFFF",
    cardDefault: "#FFFFFF",
    cardBright: "#FFFFFF",
    overlay: "#000000",
    onboardingOverlay: "#080A0B",
    popup: "#212323",
    tabbar: "#080A0B",
  },
  gray30: "#E3E5E8",
  gray70: "#757C8A",
  lilac150: "#161616",
  stroke: {
    default: "#FFFFFF",
    negative: "#FD0058",
  },
  input: {
    default: "#FFFFFF",
    nonDefault: "#080A0B",
  },
  password: {
    weak: "#F87700",
    normal: "#EACB00",
    strong: "#6EFF46",
  },
  black: "#000000",

  button: {
    primaryLevel1Bg: "#FFFFFF",
    primaryLevel1Action: "#000000",
    primaryWhiteBg: "#FFFFFF",
    primaryWhiteAction: "#080A0B",
    secondaryBg: "#080A0B",
    secondaryContent: "#FFFFFF",
    secondaryStroke: "rgba(255, 255, 255, 0.7)",
    tertiaryContent: "#B9B9B9",
    negativeBg: "#FD0058",
    negativeContent: "#FFFFFF",
    additionalBrightBg: "rgba(255, 255, 255, 0.15)",
    additionalBrightContent: "#FD4B03",
    additionalDefaultBg: "rgba(255, 255, 255, 0.15)",
    additionalDefaultContent: "#FFFFFF",
    // See gradients.ts buttonGlassStroke for the gradient part of this.
    glassBg: "rgba(12, 14, 16, 0.62)",
    glassContent: "#FFFFFF",
    logoutBg: "#FFFFFF",
    logoutContent: "#FD0058",
    staDeleteBg: "#FD0058",
    staDeleteAction: "#FFFFFF",
    staComplainBg: "#FD4B03",
    staComplainAction: "#FFFFFF",
    staEditBg: "#973BFF",
    staEditAction: "#FFFFFF",
    staShareBg: "#03BA46",
    staShareAction: "#FFFFFF",
  },
  chip: {
    defaultBg: "#FFFFFF",
    defaultContent: "#FFFFFF",
    selectedBg: "#080A0B",
    selectedContent: "#FFFFFF",
  },
  donation: {
    defaultStroke: "#FFFFFF",
    selectedBg: "#080A0B",
  },
  control: {
    offBg: "rgba(255, 255, 255, 0.2)",
    offBorder: "rgba(255, 255, 255, 0.2)",
    offContent: "#FFFFFF",
    onContent: "#FFFFFF",
    // onBg is a gradient — see gradients.ts controlOn.
  },
  glass: {
    // Frosted surfaces (cards/sheets) that let background color bleed
    // through. Heavy blur (40px) kills that bleed — lighter blur +
    // boosted saturation instead (see BlurView usage: blurAmount 16,
    // paired with this fill).
    bgSolid5: "rgba(255, 255, 255, 0.05)",
  },
  // White-opacity scale from the Pulsee handoff README ("Surface fills" /
  // "Strokes") — cards, chips, inputs, control tracks, hairlines. Named
  // by opacity percentage, matching the source's own --surface-fill-N /
  // implicit stroke-opacity naming so a value here maps 1:1 back to spec.
  surfaceFill: {
    5: "rgba(255, 255, 255, 0.05)",
    10: "rgba(255, 255, 255, 0.10)",
    15: "rgba(255, 255, 255, 0.15)",
    20: "rgba(255, 255, 255, 0.20)",
  },
  strokeWhite: {
    5: "rgba(255, 255, 255, 0.05)",
    15: "rgba(255, 255, 255, 0.15)",
    70: "rgba(255, 255, 255, 0.70)",
  },
} as const;
