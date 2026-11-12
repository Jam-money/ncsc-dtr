import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { localSupabase, checked } from "../scripts/local-supabase.mjs";
const local = localSupabase();
const metadata = {
  full_name: "NCSC fixture",
  student_id: "TEST",
  company: "NCSC",
  ojt_title: "Staff",
};

test("public signup cannot create the retired processing category or retain a partial Auth user", async () => {
  const email = `${randomUUID()}@ncsc.local.test`;
  const client = local.client();
  const result = await client.auth.signUp({
    email,
    password: `Test!${randomUUID()}`,
    options: { data: { ...metadata, account_type: "processing", required_workdays: 20 } },
  });
  assert.ok(result.error);
  assert.equal(
    checked(await local.admin.auth.admin.listUsers({ perPage: 1000 })).users.some(
      (u) => u.email === email,
    ),
    false,
  );
});
test("trusted Auth creation rejects processing atomically", async () => {
  const email = `${randomUUID()}@ncsc.local.test`;
  const result = await local.admin.auth.admin.createUser({
    email,
    password: `Test!${randomUUID()}`,
    email_confirm: true,
    app_metadata: { dtr_account_type: "processing", dtr_required_workdays: 20 },
    user_metadata: metadata,
  });
  assert.ok(result.error);
  assert.equal(
    checked(await local.admin.auth.admin.listUsers({ perPage: 1000 })).users.some(
      (u) => u.email === email,
    ),
    false,
  );
});
test("database constraints reject category conversion and day targets without damaging OJT or attendance", async () => {
  const password = `Test!${randomUUID()}`;
  const { user } = checked(
    await local.admin.auth.admin.createUser({
      email: `${randomUUID()}@ncsc.local.test`,
      password,
      email_confirm: true,
      user_metadata: metadata,
    }),
  );
  const sql = postgres(local.databaseUrl, { max: 1, onnotice: () => {} });
  try {
    checked(
      await local.admin.from("dtr_entries").insert({
        user_id: user.id,
        entry_date: "2000-01-01",
        check_in: "2000-01-01T08:00:00+08:00",
        check_out: "2000-01-01T16:00:00+08:00",
      }),
    );
    await assert.rejects(
      sql`UPDATE public.profiles SET account_type='processing',student_id=NULL,required_workdays=20 WHERE id=${user.id}`,
      /ncsc_supported_account_type|ncsc_no_day_target/,
    );
    await assert.rejects(
      sql`UPDATE public.profiles SET account_type='job_order',student_id=NULL,required_workdays=20 WHERE id=${user.id}`,
    );
    const profile = checked(await local.admin.from("profiles").select().eq("id", user.id).single());
    assert.equal(profile.account_type, "ojt");
    assert.equal(
      checked(await local.admin.from("dtr_entries").select().eq("user_id", user.id)).length,
      1,
    );
    const client = local.client();
    checked(await client.auth.signInWithPassword({ email: user.email, password }));
    // Existing RLS tests cover other identities; verify the NCSC addition did not allow self elevation.
    const rejected = await client.from("profiles").update({ is_admin: true }).eq("id", user.id);
    assert.ok(rejected.error || rejected.data === null);
    assert.equal(
      checked(await local.admin.from("profiles").select("is_admin").eq("id", user.id).single())
        .is_admin,
      false,
    );
    await client.auth.signOut();
  } finally {
    checked(await local.admin.from("dtr_entries").delete().eq("user_id", user.id));
    checked(await local.admin.auth.admin.deleteUser(user.id));
    await sql.end();
  }
});
