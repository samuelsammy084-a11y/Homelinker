import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const file = ts.createSourceFile("page.tsx",
  readFileSync(new URL("../app/verify/page.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const page = file.statements.find((node) => node.name?.text === "VerifyPage");
const handler = page.body.statements.find((node) => node.name?.text === "startVerification");
const source = ts.transpileModule(handler.getText(file), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture(response) {
  const events = [];
  const start = runInNewContext(source + "\nstartVerification;", {
    startInProgress: { current: false },
    setStarting() {},
    supabase: { auth: { getSession: async () => ({ data: { session: { access_token: "mock" } } }) } },
    fetch: async () => { events.push("request"); return response; },
    router: { push: (path) => events.push(path) },
    toast: { error: (message) => events.push(message), success: (message) => events.push(message) },
    loadVerification: async () => events.push("refresh"),
    console: { error() {} },
  });
  return { start, events };
}

test("an expired verification session returns through login to verification", async () => {
  const { start, events } = fixture(new Response(null, { status: 401 }));
  await start();
  assert.equal(events.at(-1), "/login?next=%2Fverify");
});

test("duplicate starts send one request and an already verified result refreshes status", async () => {
  const { start, events } = fixture(Response.json({ code: "ALREADY_VERIFIED" }, { status: 409 }));
  await Promise.all([start(), start()]);
  assert.deepEqual(events, ["request", "refresh", "Your identity is already verified."]);
});

test("a non-JSON verification outage shows an actionable message", async () => {
  const { start, events } = fixture(new Response("Service unavailable", { status: 503 }));
  await start();
  assert.deepEqual(events, ["request", "Could not start identity verification."]);
});
