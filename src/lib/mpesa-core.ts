// Pure M-Pesa helpers — no framework dependencies, runs in any JS environment

const MPESA_BASE = process.env.MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

export function formatPhone(phone: string): string {
  const clean = phone.replace(/[\s+\-()]/g, "");
  if (clean.startsWith("0")) return `254${clean.slice(1)}`;
  if (clean.startsWith("254")) return clean;
  return clean;
}

export function timestamp(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getHours()).padStart(2, "0"),
    String(d.getMinutes()).padStart(2, "0"),
    String(d.getSeconds()).padStart(2, "0"),
  ].join("");
}

export function mkPassword(shortCode: string, passkey: string, ts: string): string {
  return btoa(`${shortCode}${passkey}${ts}`);
}

export async function getToken(key: string, secret: string): Promise<string> {
  const res = await fetch(
    `${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` } },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OAuth failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const json = await res.json() as { access_token: string };
  return json.access_token;
}

export async function initiateStkPush(
  phone: string,
  reference: string,
  env: { key: string; secret: string; passkey: string; shortcode: string; callbackUrl: string },
): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
  const token = await getToken(env.key, env.secret);
  const ts    = timestamp();
  const pwd   = mkPassword(env.shortcode, env.passkey, ts);

  const res = await fetch(`${MPESA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      BusinessShortCode: env.shortcode,
      Password: pwd,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: 100,
      PartyA: formatPhone(phone),
      PartyB: env.shortcode,
      PhoneNumber: formatPhone(phone),
      CallBackURL: env.callbackUrl,
      AccountReference: reference,
      TransactionDesc: "Vites Facilitation Fee",
    }),
  });

  let json: { ResponseCode: string; ResponseDescription: string; MerchantRequestID: string; CheckoutRequestID: string };
  try {
    json = await res.json() as typeof json;
  } catch {
    const text = await res.text().catch(() => "(unreadable)");
    throw new Error(`Daraja returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  if (json.ResponseCode !== "0") {
    throw new Error(`[${json.ResponseCode}] ${json.ResponseDescription || JSON.stringify(json)}`);
  }

  return { checkoutRequestId: json.CheckoutRequestID, merchantRequestId: json.MerchantRequestID };
}

export async function queryStkStatus(
  checkoutRequestId: string,
  env: { key: string; secret: string; passkey: string; shortcode: string },
): Promise<{ ResultCode: string; ResultDesc: string; pending?: boolean }> {
  try {
    const token = await getToken(env.key, env.secret);
    const ts    = timestamp();
    const pwd   = mkPassword(env.shortcode, env.passkey, ts);

    const res = await fetch(`${MPESA_BASE}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        BusinessShortCode: env.shortcode,
        Password: pwd,
        Timestamp: ts,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    if (!res.ok) return { ResultCode: "", ResultDesc: "", pending: true };

    const json = await res.json() as { ResultCode?: string; ResultDesc?: string; errorCode?: string };
    if (json.errorCode) return { ResultCode: "", ResultDesc: "", pending: true };

    return { ResultCode: json.ResultCode ?? "", ResultDesc: json.ResultDesc ?? "", pending: false };
  } catch {
    return { ResultCode: "", ResultDesc: "", pending: true };
  }
}
