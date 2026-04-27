import { serve } from "@hono/node-server";
import { Hono } from "hono";
import stkHandler      from "../api/mpesa/stk";
import queryHandler    from "../api/mpesa/query";
import callbackHandler from "../api/mpesa/callback";
import saveHandler     from "../api/applications/save";

const app = new Hono();

// Manual CORS — runs before every request including OPTIONS preflight
app.use("*", async (c, next) => {
  const origin = process.env.FRONTEND_URL ?? "*";
  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  c.header("Access-Control-Max-Age", "86400");

  // Respond to preflight immediately
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
});

// Wrap existing Fetch-API handlers — no code duplication
function mount(handler: (req: Request) => Promise<Response>) {
  return async (c: { req: { raw: Request } }) => handler(c.req.raw);
}

app.post("/api/mpesa/stk",          mount(stkHandler));
app.post("/api/mpesa/query",        mount(queryHandler));
app.post("/api/mpesa/callback",     mount(callbackHandler));
app.post("/api/applications/save",  mount(saveHandler));

app.get("/health", (c) => c.json({ ok: true }));

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port }, () => {
  console.log(`Render backend listening on port ${port}`);
});
