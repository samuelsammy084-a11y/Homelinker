import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("saving a stale Profile preserves a newly approved verification", async () => {
  const source = readFileSync(new URL("../app/profile/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const page = file.statements.find((node) => node.name?.text === "ProfilePage");
  const handler = page.body.statements.find((node) => node.name?.text === "handleSaveProfile");
  const { outputText } = ts.transpileModule("(" + handler.getText(file) + ")", {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });
  const storedProfile = { is_verified: true, verification_status: "verified" };
  let payload;
  let displayedProfile;
  const messages = [];
  const save = runInNewContext(outputText, {
    userId: "test-owner",
    profile: {
      full_name: " Test Owner ", phone_number: " 0610000000 ",
      avatar_url: "", bio: " Owner ", role: "property_owner",
      is_verified: false, verification_status: "pending",
    },
    supabase: {
      from(table) {
        assert.equal(table, "profiles");
        return {
          upsert(values) {
            payload = values;
            Object.assign(storedProfile, values);
            return { select: () => ({ single: async () => ({ data: storedProfile }) }) };
          },
        };
      },
    },
    setSaving() {},
    setProfile: (value) => { displayedProfile = value; },
    toast: { success: (message) => messages.push(message), error: assert.fail },
    console: { error: assert.fail },
  });

  await save();
  assert.equal(Object.hasOwn(payload, "is_verified"), false);
  assert.equal(Object.hasOwn(payload, "verification_status"), false);
  assert.equal(payload.id, "test-owner");
  assert.equal(payload.full_name, "Test Owner");
  assert.equal(payload.phone_number, "0610000000");
  assert.equal(displayedProfile.is_verified, true);
  assert.equal(displayedProfile.verification_status, "verified");
  assert.deepEqual(messages, ["Profile saved successfully!"]);
});
