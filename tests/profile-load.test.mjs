import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("Profile reports a failed lookup and restores saved details on retry", async () => {
  const source = readFileSync(new URL("../app/profile/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const page = file.statements.find((node) => node.name?.getText(file) === "ProfilePage");
  const effect = page.body.statements.find(
    (node) => ts.isExpressionStatement(node) && node.expression.expression?.getText(file) === "useEffect",
  );
  const loader = effect.expression.arguments[0].body.statements.find(
    (node) => node.name?.getText(file) === "loadProfile",
  );
  const { outputText } = ts.transpileModule("(" + loader.getText(file) + ")", {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });

  let profileResult = { error: new Error("Temporary Profile lookup failure") };
  let loading = true;
  let failed = false;
  let savedProfile;
  const requestedTables = [];
  const loadProfile = runInNewContext(outputText, {
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "test-user" } } }) },
      from(table) {
        requestedTables.push(table);
        const query = {
          select: () => query,
          eq: () => query,
          order: () => query,
          limit: () => query,
          maybeSingle: async () => table === "profiles" ? profileResult : { data: null },
        };
        return query;
      },
    },
    setUserId() {},
    setEmail() {},
    setLoading: (value) => { loading = value; },
    setLoadFailed: (value) => { failed = value; },
    setProfile: (value) => { savedProfile = value; },
    console: { error() {} },
  });

  await loadProfile();
  assert.equal(loading, false);
  assert.equal(failed, true);
  assert.equal(savedProfile, undefined);
  assert.deepEqual(requestedTables, ["profiles"]);

  // The retry button clears the error before the next lookup.
  failed = false;
  profileResult = { data: { full_name: "Test Owner", is_verified: true, verification_status: "verified" } };
  await loadProfile();
  assert.equal(loading, false);
  assert.equal(failed, false);
  assert.equal(savedProfile.full_name, "Test Owner");
  assert.equal(savedProfile.is_verified, true);
  assert.deepEqual(requestedTables, ["profiles", "profiles", "verification_requests"]);
});
