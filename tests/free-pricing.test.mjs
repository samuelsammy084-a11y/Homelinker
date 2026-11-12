import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const file = ts.createSourceFile(
  "page.tsx",
  readFileSync(new URL("../app/pricing/page.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const pricing = file.statements.find((node) => node.name?.text === "PricingContent");
const handler = pricing.body.statements.find((node) => node.name?.text === "startFreePlan");
const source = ts.transpileModule(handler.getText(file), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;

function freePlan({ status = 200, session = { access_token: "test" } } = {}) {
  const location = { href: "" };
  const alerts = [];
  const publish = runInNewContext(source + "\nstartFreePlan;", {
    getPropertyId: () => "17",
    setLoadingPlan() {},
    alert: (message) => alerts.push(message),
    supabase: { auth: { getSession: async () => ({ data: { session } }) } },
    fetch: async () => new Response(JSON.stringify({ success: status === 200 }), { status }),
    window: { location },
    sessionStorage: { removeItem() { throw new Error("Storage unavailable"); } },
  });
  return { publish, location, alerts };
}

test("returns to the same Free listing after signing in", async () => {
  for (const options of [{ session: null }, { status: 401 }]) {
    const { publish, location } = freePlan(options);
    await publish();
    const url = new URL(location.href, "https://www.homelinker.co.za");
    assert.equal(url.pathname, "/login");
    assert.equal(url.searchParams.get("next"), "/pricing?propertyId=17");
  }
});

test("successful Free publishing opens the dashboard even if storage is unavailable", async () => {
  const { publish, location, alerts } = freePlan();
  await publish();
  assert.equal(location.href, "/dashboard");
  assert.deepEqual(alerts, []);
});
