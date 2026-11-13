import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/api/webhooks/didit/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

test("Didit approval retries reconcile the stored owner's profile after a temporary failure", async () => {
  const verification = {
    id: "verification-record",
    user_id: "listing-owner",
    status: "pending",
    created_at: "2026-11-13T00:00:00Z",
  };
  const profileWrites = [];
  let sessionWrites = 0;
  const client = {
    from(table) {
      let update;
      const filters = {};
      const query = {
        eq(column, value) {
          filters[column] = value;
          return query;
        },
        gt: () => query,
        limit: async () => ({ data: [] }),
        maybeSingle: async () => {
          assert.equal(filters.provider, "didit");
          assert.equal(filters.provider_session_id, "mock-session");
          return { data: { ...verification } };
        },
        select: () => query,
        update(values) {
          update = values;
          return query;
        },
        then(resolve) {
          if (table === "identity_verifications") {
            assert.equal(filters.id, verification.id);
            sessionWrites++;
            Object.assign(verification, update);
          }
          if (table === "profiles") {
            assert.equal(filters.id, verification.user_id);
            profileWrites.push(update);
            if (profileWrites.length === 1) {
              return resolve({ error: { message: "Temporary database failure" } });
            }
          }
          return resolve({ error: null });
        },
      };
      return query;
    },
  };

  const secret = "mock-webhook-secret";
  const exports = {};
  runInNewContext(outputText, {
    exports,
    Buffer,
    console: { error() {} },
    process: {
      env: {
        DIDIT_WEBHOOK_SECRET: secret,
        DIDIT_WORKFLOW_ID: "mock-workflow",
        NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
        SUPABASE_SERVICE_ROLE_KEY: "mock-service-role",
      },
    },
    require: (name) => ({
      "next/server": { NextResponse: Response },
      "node:crypto": { createHmac, timingSafeEqual },
      "@supabase/supabase-js": { createClient: () => client },
    })[name],
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({
    environment: "live",
    session_id: "mock-session",
    status: "Approved",
    timestamp,
    webhook_type: "status.updated",
    workflow_id: "mock-workflow",
  });
  const signature = createHmac("sha256", secret).update(body).digest("hex");
  const deliver = () => exports.POST(new Request("http://localhost/api/webhooks/didit", {
    method: "POST",
    body,
    headers: { "x-timestamp": String(timestamp), "x-signature-v2": signature },
  }));

  assert.equal((await deliver()).status, 500);
  assert.equal(verification.status, "approved");
  assert.equal((await deliver()).status, 200);
  assert.equal(sessionWrites, 1);
  assert.equal(profileWrites.length, 2);
  assert.equal(profileWrites[1].is_verified, true);
  assert.equal(profileWrites[1].verification_status, "verified");
});
