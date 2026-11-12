# NCSC DTR System

Independent attendance application for the National Commission of Senior Citizens.
Derived from the handed-over PSA system; it has its own database, credentials,
repository and deployment. No employee data is copied.

Supported categories: OJT/Immersions, JO/COS/GIP, Regular / Contractual Employees.
Only OJT has a progress target. JO and Regular support Travel Out. Administrator,
Chief approval and read-only security monitoring retain the established workflow.
The security username is `ncscsecurity`; credentials are provisioned separately.

## Local development

From this directory with Docker running:

```powershell
npm ci
npm run local:start
npm run local:seed
npm run local:dev
```

Open http://localhost:3000. Mailpit is http://127.0.0.1:56324.
The NCSC stack uses project ID `ncsc-dtr-local`, API port 56321 and DB port 56322.
Do not point `DTR_LOCAL_WORKDIR` at the PSA stack. Local fixture credentials stay
in ignored `.local-test-accounts.json`. No `.env` or production key is included.

See [DEPLOYMENT.md](DEPLOYMENT.md) and [AUTH_PRODUCTION.md](AUTH_PRODUCTION.md).
Files under `docs/psa-baseline` describe the predecessor system; they are historical
reference, not proof that NCSC has been deployed or tested.

## Schema compatibility

The inherited migrations and enum retain the former Processing category for
compatibility. The final NCSC migration forbids it and all day targets at the
database boundary. It refuses a populated Auth database, protecting an existing
installation against accidental conversion. Apply only to a fresh NCSC project.
Historical Processing-only integration tests are archived outside the active suite.

## Branding

Logo source: https://www.ncsc.gov.ph/ (official NCSC logo asset).
The general application title intentionally omits regional-office claims.
Print and Word supervisor names say `Replace with supervisor name`; fill in the
authorized supervisor before submitting a final DTR.
