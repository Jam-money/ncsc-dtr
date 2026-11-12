# NCSC deployment and handover

This is a separate deployment. Never reuse a PSA database URL, service-role key,
Vercel project link or Chief secret. Local source setup is not a deployment.

1. Create a fresh NCSC Supabase project and an empty `ncsc-dtr-system` repository.
2. Verify the new project reference and that Auth and application data are empty.
3. Review/apply the complete ordered `supabase/migrations` chain to that project.
   The NCSC-specific migration is deliberately fresh-install only.
4. Provision a new administrator and `ncscsecurity` account with unique passwords.
   Install a new Chief approval password/recovery code through the trusted setup.
   Do not use the local seed script against hosted services.
5. Import the NCSC repository into a separate Vercel project. Use the checked-in
   TanStack Start configuration. Choose the production branch explicitly.
6. Set the following in Vercel Production using only the NCSC project's values:

| Variable | Kind |
| --- | --- |
| VITE_SUPABASE_URL | Public project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Public anon/publishable key |
| SUPABASE_URL | Same project URL |
| SUPABASE_PUBLISHABLE_KEY | Public anon/publishable key |
| SUPABASE_SERVICE_ROLE_KEY | Server-only secret |
| PUBLIC_SITE_URL | Final stable HTTPS NCSC deployment origin |

7. Configure Supabase email and exact redirect URLs as in AUTH_PRODUCTION.md.
8. Verify signup/confirmation, recovery, all three categories, punch persistence,
   Travel Out, exports, inactive access, guard isolation and Chief-approved actions.
9. Transfer hosting/repository/database/sender ownership as agreed at handover.
   Deliver passwords and Chief recovery codes privately, not in repository files.

The destination for hosted helper scripts must be supplied explicitly through
`NCSC_SUPABASE_PROJECT_REF`. Known PSA projects are rejected. Never run migrations
against the PSA project. No hosted destination is preconfigured in this copy.

Before release run `npm run test:local`, `npm run test:provisioning`,
`npm run test:account-types`, `npm run test:e2e`, `npm run typecheck`, changed-file
lint and `npm run build`. Environment files, test credentials and test output are
excluded from source control and deployment.
