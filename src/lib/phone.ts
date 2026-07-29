/**
 * Several forms show a fixed Nigerian flag + "+234" as a *decorative*
 * prefix on the phone field (it doesn't adapt per selected country, and
 * isn't baked into the raw input value). Rather than silently submitting
 * a number the backend's `/^\+?[1-9]\d{7,14}$/` rule would then reject,
 * this prepends it when the user hasn't already typed a leading "+".
 *
 * This is a real limitation of the current UI (the prefix doesn't change
 * if a non-Nigerian country is picked) — not a full international phone
 * input. Flagged here rather than silently working around it forever.
 */
export function normalizePhoneNumber(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return trimmed;
  return `+234${trimmed.replace(/^0+/, "")}`;
}
