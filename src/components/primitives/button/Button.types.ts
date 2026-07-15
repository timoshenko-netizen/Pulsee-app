import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "additional" | "glass" | "negative";
export type ButtonSize = "l" | "m" | "s" | "xs";

/** Only meaningful for variant="primary" (level1/level2/level3/white) or variant="additional" (default/bright) — ignored for other variants. */
export type ButtonTone = "level1" | "level2" | "level3" | "white" | "default" | "bright";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: ReactNode;
};
