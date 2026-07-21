// Intentional no-op for destinations not yet built in the design handoff.
// Mirrors the handoff's own `soon(feature, targetFlow)` convention — never surface a snackbar here.
export function soon(feature: string, targetFlow: string) {}
