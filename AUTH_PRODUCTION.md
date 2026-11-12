# NCSC email configuration

Local development uses the isolated Supabase stack and Mailpit on port 56324.
Production keeps Supabase Auth with Custom SMTP; no email service is added to
browser code.

## Temporary shared sender

The owner approved temporarily using `psa10office@gmail.com`. Configure this only
on the new NCSC Supabase project's Authentication email/SMTP settings:

- Sender display name: NCSC DTR
- Sender address and SMTP username: psa10office@gmail.com
- Host: smtp.gmail.com
- Port: 465
- Password: Gmail app password entered privately in Supabase SMTP settings

The actual PSA Gmail address remains visible, and both applications share the
mailbox's provider limits. Do not change PSA's SMTP configuration. Prefer a separate
app password for this NCSC connection so replacement does not disrupt PSA.
Never save SMTP passwords in source, Vite variables or committed environment files.

## URLs and delivery verification

After the stable NCSC domain exists, set Supabase Site URL and Vercel
PUBLIC_SITE_URL to that exact HTTPS origin. Add that origin and
`https://YOUR_NCSC_DOMAIN/reset-password?flow=recovery` to the redirect allow-list.
Use the NCSC name and link destination in confirmation and password-reset templates.
Keep local redirects only when intentionally required; do not copy PSA redirects.

Verify confirmation and password recovery using an authorized test recipient.
Check Inbox and Spam. Test invalid, expired and reused links and login with the new
password. The neutral forgot-password response intentionally does not prove delivery.

## Replace the sender at handover

The receiving custodian supplies the NCSC-controlled mailbox/provider. Replace
sender address, display name, SMTP username and password in NCSC Supabase only.
Send confirmation/recovery tests, confirm their NCSC destination, then retire only
the NCSC-specific old app password. Never revoke a credential still used by PSA.
