# NCSC duplication review

Reviewed 3 November 2026. This is the separate NCSC source, not a production
deployment or a migration of PSA employee data.

## Implemented

- Official NCSC logo, agency name, page metadata and report filenames.
- OJT/Immersions, JO/COS/GIP and Regular / Contractual Employees only in account
  creation, signup and filters. Trusted provisioning rejects Processing inputs.
- Final fresh-database migration rejects Processing profiles and day targets,
  including direct Auth signup, without modifying the inherited migration chain.
- Print and Word supervisor names use `Replace with supervisor name`.
- Separate `ncscsecurity` username, local database ports and hosted project selection.
- Runtime, build and hosted-helper safeguards reject known PSA database destinations.
- Clean initial Git history; predecessor history/environment files are not published.
- Fresh deployment and temporary SMTP sender replacement instructions.

## Verification

- Production build and deployable-artifact credential scan passed.
- Changed-file lint and TypeScript checking passed.
- Full browser suite: 87 passed initially; one inherited security-filter test still
  selected Processing. That fixture was corrected to test an available category and
  assert Processing is absent. The subsequent eight targeted browser checks passed,
  including the new NCSC branding check, all three account types and report
  supervisor placeholders. No browser test failure remains unresolved.
- Nine final NCSC/deployment-safety unit checks passed.
- Real Auth provisioning and rollback checks passed for all three categories.
- Desktop/mobile landing, signup and report screenshots were inspected.
- Final database suite: 90 of 91 passed on the post-restart run. The first RLS
  test encountered `Could not query the database for the schema cache. Retrying.`
  during Docker/Supabase startup. Its isolated rerun passed both access/profile
  tests after readiness. All 91 current checks have passed; no database failure
  remains unresolved. The earlier run with Docker stopped was environmental.

## Limitations and remaining setup

- Production Supabase project reference has not yet been supplied. No hosted
  migrations, accounts, Chief secrets, SMTP settings or deployments were created.
- Temporary sender `psa10office@gmail.com` is documented, not automatically connected.
  Its visible address and provider capacity will be shared until NCSC replaces it.
- Production dependency audit reported zero known vulnerabilities. Full npm audit
  reported 14 moderate development dependency findings stemming from the inherited
  minimatch/lint-tool dependency chain; no unrelated breaking downgrade was applied.
- Existing build warnings about bundle size/module directives remain.
- Legacy Processing helper/schema definitions remain for migration compatibility;
  the NCSC database constraints prevent creating such profiles. Historical tests
  applicable only to PSA are retained as text under `tests/legacy-psa`.
