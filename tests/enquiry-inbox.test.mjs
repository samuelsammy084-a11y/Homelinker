import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

test("enquiries are grouped by the signed-in user's role in the conversation", () => {
  const file = ts.createSourceFile(
    "page.tsx",
    readFileSync(new URL("../app/messages/page.tsx", import.meta.url), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const handler = file.statements.find((node) => node.name?.text === "filterConversations");
  const source = ts.transpileModule(handler.getText(file), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const filter = runInNewContext(source + "\nfilterConversations;");
  const incoming = { buyer_id: "buyer", owner_id: "me" };
  const sent = { buyer_id: "me", owner_id: "other-owner" };
  const messages = [incoming, sent];
  assert.deepEqual(filter(messages, "me", "incoming"), [incoming]);
  assert.deepEqual(filter(messages, "me", "sent"), [sent]);
  assert.deepEqual(filter(messages, "me", "all"), messages);
});
