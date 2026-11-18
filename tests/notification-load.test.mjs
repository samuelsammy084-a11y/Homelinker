import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/notifications/page.tsx", import.meta.url), "utf8");
const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const page = file.statements.find((node) => node.name?.text === "NotificationsPage");
const effect = page.body.statements.find(
  (node) => ts.isExpressionStatement(node) && node.expression.expression?.getText(file) === "useEffect",
).expression.arguments[0];
const { outputText } = ts.transpileModule("(" + effect.getText(file) + ")", {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
});

function fixture(result) {
  const events = [];
  const filters = [];
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  const runEffect = runInNewContext(outputText, {
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "owner" } } }) },
      from(table) {
        assert.equal(table, "notifications");
        const query = {
          select: () => query,
          eq: (...filter) => { filters.push(filter); return query; },
          order: async () => { await pending; return result; },
        };
        return query;
      },
    },
    setNotifications: (value) => events.push(["data", value]),
    setLoading: (value) => events.push(["loading", value]),
    setLoadFailed: (value) => events.push(["failed", value]),
    console: { error() {} },
  });
  const cleanup = runEffect();
  return { events, filters, cleanup, finish };
}

async function settle(fixture) {
  fixture.finish();
  await new Promise((resolve) => setImmediate(resolve));
}

test("notification lookup errors are reported while a successful empty lookup stays empty", async () => {
  const failed = fixture({ data: null, error: new Error("Temporary outage") });
  await settle(failed);
  assert.deepEqual(failed.events, [["failed", true], ["loading", false]]);
  assert.deepEqual(failed.filters, [["user_id", "owner"]]);

  const retried = fixture({ data: [], error: null });
  await settle(retried);
  assert.deepEqual(retried.events, [["data", []], ["loading", false]]);
});

test("an abandoned notification load cannot change page state", async () => {
  const abandoned = fixture({ data: null, error: new Error("Delayed failure") });
  await Promise.resolve();
  abandoned.cleanup();
  await settle(abandoned);
  assert.deepEqual(abandoned.events, []);
});
