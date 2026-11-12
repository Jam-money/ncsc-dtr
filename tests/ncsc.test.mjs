import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { supportedAccountLabels, accountProgress } from "../src/lib/account-progress.mjs";
import { accountInput } from "../src/lib/account-input.ts";
import { assertAgencyDatabase } from "../src/lib/agency-database.ts";
import { validateProductionEnv } from "../scripts/check-deployment.mjs";

test("NCSC offers exactly the three approved employee categories", () => {
  assert.deepEqual(Object.keys(supportedAccountLabels), ["ojt", "job_order", "regular_employee"]);
  const input = {
    email: "employee@example.com",
    password: "Temporary-test!",
    fullName: "Employee",
    company: "NCSC",
    ojtTitle: "Staff",
    studentId: null,
  };
  for (const accountType of ["job_order", "regular_employee"]) {
    assert.equal(accountInput.parse({ ...input, accountType }).requiredWorkdays, null);
    assert.equal(accountProgress({ account_type: accountType }, []).unit, null);
  }
  assert.equal(
    accountInput.safeParse({ ...input, accountType: "processing", requiredWorkdays: 20 }).success,
    false,
  );
  assert.equal(
    accountInput.safeParse({ ...input, accountType: "job_order", requiredWorkdays: 20 }).success,
    false,
  );
});
test("PSA production destinations are rejected while isolated local and NCSC URLs work", () => {
  assert.throws(() => assertAgencyDatabase("https://ojaffohibrltrzrbjcsd.supabase.co"));
  assert.ok(
    validateProductionEnv({ SUPABASE_URL: "https://ojaffohibrltrzrbjcsd.supabase.co" }).some(
      (message) => message.includes("points to PSA"),
    ),
  );
  assert.throws(() => assertAgencyDatabase("https://ixbudvpdrdagshhtlhjz.supabase.co"));
  assert.doesNotThrow(() => assertAgencyDatabase("http://127.0.0.1:56321"));
  assert.doesNotThrow(() => assertAgencyDatabase("https://example-ncsc.supabase.co"));
});
test("both print and Word reports use the requested supervisor placeholder", () => {
  const source = readFileSync(
    new URL("../src/routes/_authenticated/dashboard.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(source.match(/Replace with supervisor name/g)?.length, 2);
  assert.doesNotMatch(source, /JOSE B\. TUASON|PHILIPPINE STATISTICS AUTHORITY/);
});
