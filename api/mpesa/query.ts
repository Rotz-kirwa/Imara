import { queryStkStatus } from "../../src/lib/mpesa-core";

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { checkoutRequestId } = await request.json() as { checkoutRequestId: string };

    const result = await queryStkStatus(checkoutRequestId, {
      key:       process.env.MPESA_CONSUMER_KEY!,
      secret:    process.env.MPESA_CONSUMER_SECRET!,
      passkey:   process.env.MPESA_PASSKEY!,
      shortcode: process.env.MPESA_SHORTCODE!,
    });

    return Response.json(result);
  } catch (err) {
    return Response.json({ ResultCode: "", ResultDesc: "", pending: true });
  }
}
