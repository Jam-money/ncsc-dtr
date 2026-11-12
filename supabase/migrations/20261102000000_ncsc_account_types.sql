BEGIN;
-- This agency-specific migration is for a fresh NCSC deployment only.
-- Refuse to apply to the handed-over PSA database or any populated installation.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM auth.users) THEN
    RAISE EXCEPTION 'NCSC initialization requires an empty Auth database. Do not apply to PSA.';
  END IF;
END $$;

-- Retain the inherited enum and historical function signatures to avoid rewriting
-- prior migrations. No profile can use the retired category, including service-role
-- provisioning and direct Auth signup (the deferred profile trigger is atomic).
ALTER TABLE public.profiles ADD CONSTRAINT ncsc_supported_account_type
  CHECK (account_type IN ('ojt', 'job_order', 'regular_employee'));
ALTER TABLE public.profiles ADD CONSTRAINT ncsc_no_day_target
  CHECK (required_workdays IS NULL);
COMMIT;
