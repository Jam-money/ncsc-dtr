// Public project identifiers are not credentials. Prevent accidental reuse of PSA.
const psaProjects = ["ojaffohibrltrzrbjcsd", "ixbudvpdrdagshhtlhjz", "oafwqleplhuvjsypmbuc"];
export function assertAgencyDatabase(url: string) {
  const host = new URL(url).hostname;
  if (psaProjects.some((ref) => host === `${ref}.supabase.co`)) {
    throw new Error("NCSC must use its own Supabase project. PSA connections are blocked.");
  }
}
