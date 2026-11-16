import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("notifications show read status only after an owner-scoped update is confirmed", async () => {
  const source = readFileSync(new URL("../app/notifications/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const page = file.statements.find((node) => node.name?.getText(file) === "NotificationsPage");
  const handler = page.body.statements.find((node) => node.name?.getText(file) === "markAsRead");
  const { outputText } = ts.transpileModule("(" + handler.getText(file) + ")", {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });

  const filters = [];
  let notifications = [{ id: "clicked", is_read: false }, { id: "other", is_read: false }];
  let result = { error: new Error("Temporary update failure") };
  const query = {
    update: (values) => {
      assert.equal(values.is_read, true);
      return query;
    },
    eq: (...filter) => {
      filters.push(filter);
      return query;
    },
    select: (columns) => {
      assert.equal(columns, "id");
      return query;
    },
    maybeSingle: async () => result,
  };
  const markAsRead = runInNewContext(outputText, {
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "owner" } } }) },
      from: (table) => {
        assert.equal(table, "notifications");
        return query;
      },
    },
    setNotifications: (update) => { notifications = update(notifications); },
  });

  await markAsRead("clicked");
  assert.equal(notifications[0].is_read, false);

  result = { data: null, error: null };
  await markAsRead("clicked");
  assert.equal(notifications[0].is_read, false);

  result = { data: { id: "clicked" }, error: null };
  await markAsRead("clicked");
  assert.equal(notifications[0].is_read, true);
  assert.equal(notifications[1].is_read, false);
  assert.deepEqual(filters, Array.from({ length: 3 }, () => [["id", "clicked"], ["user_id", "owner"]]).flat());
});
