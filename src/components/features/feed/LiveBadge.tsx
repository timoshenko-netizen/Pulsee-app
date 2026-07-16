import { Icon } from "@/design/icons/Icon";

/*
  Ported from starter/src/components/features/feed/LiveBadge.tsx (Figma
  "PULSEE Android" -> Feed-default -> "Live", 126355:21211). Compound
  TV-outline + "LIVE"-lettering glyph baked into one vector — distinct
  from the general icon library's live-fill/live-outline.
*/
export function LiveBadge({ size = 24 }: { size?: number }) {
  return <Icon name="live-badge" size={size} color="white" />;
}
