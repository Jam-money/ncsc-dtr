# Production follow-up: 2026-10-29

Canonical website: https://psa-dtr-system.vercel.app

Supabase project: `ojaffohibrltrzrbjcsd`. No old PSA account import is planned.

## Security updates

The previous commit `635f3a0` patched TanStack Start's server-function XSS advisory.
This follow-up updates compatible tooling dependencies and Zod to 4.6.7. No
application schemas, attendance rules, database migrations or hosted records
were changed. The Zod major upgrade requires the existing account-creation and
Chief workflows to pass before publishing.

Both the complete npm audit and the production-only audit report zero known
vulnerabilities after the update. This is a dependency advisory check, not a
guarantee that the application has no security defects.

## Verification

- Typecheck: passed.
- Vercel-target production build and artifact safety scan: passed.
- Local database/unit suite: 97 passed.
- Deployment safety suite: 6 passed.
- Full browser regression: 96 passed, one timed out waiting for a report button
  after reloading the dashboard. The isolated rerun of that confirmation-visibility
  test passed (6.8 seconds); no test assertion or timeout was relaxed. All 97
  scenarios passed across the full run and targeted rerun; the first run was not
  completely green.
- Only package manifests/lockfiles and this report changed; no source lint target.
- Existing large-bundle and plugin warnings remain; updated bundler also reports
  dependency module-directive warnings. The build completes successfully.

Read-only checks of the currently deployed website found HTTP 200 on `/`, `/auth`
and `/reset-password`, and HTTP 404 for `/.env` and
`/.local-test-accounts.json`. Signed-out `/dashboard` returns to `/auth` without
exposing an account. Landing/auth/reset pages hydrate successfully. Repeated
same-tab navigation into the signed-out dashboard can emit recoverable React
520/422 errors with a router `routeId` cause; the redirect still completes.
This rendering issue remains a non-blocking follow-up, not a clean-console pass.
These checks did not create accounts, send emails or change attendance.

## Settings confirmed by the owner

- Vercel Production variable `PUBLIC_SITE_URL` must be
  `https://psa-dtr-system.vercel.app` (Config, not a secret). Rebuild after saving.
- Supabase Auth Site URL must be the same canonical origin.
- Exact redirect entries must include that origin and
  `https://psa-dtr-system.vercel.app/reset-password?flow=recovery`.
- Use the canonical domain for handover, not a deployment-specific hash URL.
- Do not share production server credentials with Preview deployments.
- Gmail SMTP credentials remain exclusively in Supabase Auth settings.

The owner confirmed saving the requested Vercel variable and Supabase URLs on
2026-10-29 without manually redeploying. No authenticated hosting management
session is available to the agent; this is owner confirmation, not an independent
dashboard inspection. The next verified push will rebuild with the variable.

## Handover and recovery

Keep repository, Vercel, Supabase and sender-mailbox ownership/recovery access
with designated custodians; do not place passwords or recovery codes in Git.
Record the Ready deployment's commit and date. Repeat real confirmation and
recovery after saving canonical redirects, and verify new-password sign-in.

Before normal attendance use, retain a securely stored, restorable backup of the
new Supabase project. A source-code repository is not a database backup. Verify
the chosen export/backup includes the required application data, Auth identities
and relevant private configuration; also retain Storage objects if used. Test
restoration in a separate project. No backup or restore was performed here.

For an application failure, retain the database and prefer a forward fix or a
schema-compatible release. Do not roll back to the known-vulnerable pre-635f3a0
release or reset the database. Do not run fixture-cleanup suites against hosted
Supabase. NCSC must use separate database credentials and a separate deployment.
