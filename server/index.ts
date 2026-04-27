import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import stkHandler      from "../api/mpesa/stk";
import queryHandler    from "../api/mpesa/query";
import callbackHandler from "../api/mpesa/callback";
import saveHandler     from "../api/applications/save";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

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
