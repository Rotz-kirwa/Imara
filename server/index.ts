import { serve } from "@hono/node-server";
import { Hono } from "hono";
import stkHandler      from "../api/mpesa/stk";
import queryHandler    from "../api/mpesa/query";
import callbackHandler from "../api/mpesa/callback";
import saveHandler     from "../api/applications/save";

const app = new Hono();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ?? process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function getAllowOrigin(requestOrigin: string | null): string {
  if (ALLOWED_ORIGINS.length === 0) return "*";
  if (!requestOrigin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];
}

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": getAllowOrigin(origin),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function withCors(response: Response, origin: string | null) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(origin))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Manual CORS — runs before every request including OPTIONS preflight
app.use("*", async (c, next) => {
  const origin = c.req.header("Origin") ?? null;
  const headers = corsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) {
    c.header(key, value);
  }

  if (c.req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  await next();
});

// Wrap existing Fetch-API handlers — no code duplication
function mount(handler: (req: Request) => Promise<Response>) {
  return async (c: { req: { raw: Request; header: (name: string) => string | undefined } }) =>
    withCors(await handler(c.req.raw), c.req.header("Origin") ?? null);
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
