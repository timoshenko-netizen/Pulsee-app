// Ported 1:1 from tokens.css's --spacing-* scale.
export const spacing = {
  "4xs": 4,
  "3xs": 8,
  "2xs": 10,
  xs: 14,
  s: 16,
  m: 20,
  l: 22,
  xl: 24,
} as const;

// Ported 1:1 from tokens.css's --radius-* scale.
export const radii = {
  smallObject: 8,
  card: 24,
  mediumObjects: 20,
  largeObjects: 40,
  button: 100, // pill — all button heights use full rounding
} as const;
