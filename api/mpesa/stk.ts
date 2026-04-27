import { initiateStkPush } from "../../src/lib/mpesa-core";

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { phone, reference } = await request.json() as { phone: string; reference: string };

    const result = await initiateStkPush(phone, reference, {
      key:         process.env.MPESA_CONSUMER_KEY!,
      secret:      process.env.MPESA_CONSUMER_SECRET!,
      passkey:     process.env.MPESA_PASSKEY!,
      shortcode:   process.env.MPESA_SHORTCODE!,
      callbackUrl: process.env.MPESA_CALLBACK_URL!,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "STK push failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
