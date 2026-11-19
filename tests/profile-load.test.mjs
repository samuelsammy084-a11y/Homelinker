import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/profile/page.tsx", import.meta.url), "utf8");
const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const page = file.statements.find((node) => node.name?.text === "ProfilePage");
const effect = page.body.statements.find(
  (node) => ts.isExpressionStatement(node) && node.expression.expression?.getText(file) === "useEffect",
).expression.arguments[0];
const { outputText } = ts.transpileModule("(" + effect.getText(file) + ")", {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
});

async function load(result) {
  const events = [];
  const filters = [];
  const runEffect = runInNewContext(outputText, {
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "owner", email: "test@example.com" } } }) },
      from(table) {
        const query = {
          select: () => query,
          eq: (...filter) => { filters.push([table, ...filter]); return query; },
          order: () => query,
          limit: () => query,
          maybeSingle: async () => table === "profiles" ? result : { data: null },
        };
        return query;
      },
    },
    router: { replace: assert.fail },
    setUserId() {}, setEmail() {}, setVerificationRequest() {},
    setProfile: (value) => events.push(["profile", value]),
    setLoading: (value) => events.push(["loading", value]),
    setLoadFailed: (value) => events.push(["failed", value]),
    toast: { error() {} }, console: { error() {} },
  });
  runEffect();
  await new Promise((resolve) => setImmediate(resolve));
  return { events, filters };
}

test("Profile lookup failure blocks the default editable profile until a successful retry", async () => {
  const failed = await load({ data: null, error: new Error("Temporary outage") });
  assert.ok(failed.events.some(([key, value]) => key === "failed" && value === true));
  assert.equal(failed.events.some(([key]) => key === "profile"), false);
  assert.deepEqual(failed.filters, [["profiles", "id", "owner"]]);

  const retried = await load({ data: { full_name: "Test Owner", is_verified: true, verification_status: "verified" }, error: null });
  assert.ok(retried.events.some(([key, value]) => key === "failed" && value === false));
  const profile = retried.events.find(([key]) => key === "profile")[1];
  assert.equal(profile.full_name, "Test Owner");
  assert.equal(profile.is_verified, true);
  assert.equal(profile.verification_status, "verified");
  assert.deepEqual(retried.events.at(-1), ["loading", false]);
});
