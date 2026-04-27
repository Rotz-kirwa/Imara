import { createServerFn } from "@tanstack/react-start";
import { createPendingMpesaPayment, getMpesaStatus, saveMpesaStatus } from "@/lib/mpesa-status";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPhone(phone: string): string {
  const clean = phone.replace(/[\s+\-()]/g, "");
  if (clean.startsWith("0")) return `254${clean.slice(1)}`;
  if (clean.startsWith("254")) return clean;
  return clean;
}

function timestamp(): string {
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

function mkPassword(shortCode: string, passkey: string, ts: string): string {
  return btoa(`${shortCode}${passkey}${ts}`);
}

async function getToken(key: string, secret: string): Promise<string> {
  const res = await fetch(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` } }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OAuth failed (${res.status}): ${body.slice(0, 200)}`);
  }
  const json = await res.json() as { access_token: string };
  return json.access_token;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type StkResult   = { checkoutRequestId: string; merchantRequestId: string };
export type QueryResult  = { ResultCode: string; ResultDesc: string; pending?: boolean };

type StkPushResponse = {
  ResponseCode?: string;
  ResponseDescription?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  errorCode?: string;
  errorMessage?: string;
};

// ── Server Functions ──────────────────────────────────────────────────────────

export const stkPush = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; reference: string }) => d)
  .handler(async (ctx): Promise<StkResult> => {
    const { phone, reference } = ctx.data;

    const CONSUMER_KEY    = process.env.MPESA_CONSUMER_KEY!;
    const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
    const PASSKEY         = process.env.MPESA_PASSKEY!;
    const SHORTCODE       = process.env.MPESA_SHORTCODE!;
    const CALLBACK_URL    = process.env.MPESA_CALLBACK_URL!;

    const token = await getToken(CONSUMER_KEY, CONSUMER_SECRET);
    const ts    = timestamp();
    const pwd   = mkPassword(SHORTCODE, PASSKEY, ts);

    const res = await fetch(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BusinessShortCode: SHORTCODE,
          Password: pwd,
          Timestamp: ts,
          TransactionType: "CustomerPayBillOnline",
          Amount: 100,
          PartyA: formatPhone(phone),
          PartyB: SHORTCODE,
          PhoneNumber: formatPhone(phone),
          CallBackURL: CALLBACK_URL,
          AccountReference: reference,
          TransactionDesc: "Apex Finance Facilitation Fee",
        }),
      }
    );

    let json: StkPushResponse;
    try {
      json = await res.json() as StkPushResponse;
    } catch {
      const text = await res.text().catch(() => "(unreadable)");
      throw new Error(`Daraja returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
    }

    if (json.errorCode) {
      if (json.errorCode === "500.001.1001") {
        throw new Error("You already have an active M-Pesa prompt. Check your phone and enter your PIN, or wait a moment before trying again.");
      }
      throw new Error(json.errorMessage ?? `M-Pesa request failed (${json.errorCode}).`);
    }

    if (json.ResponseCode !== "0") {
      throw new Error(json.ResponseDescription || "M-Pesa request failed.");
    }

    await createPendingMpesaPayment({
      checkoutRequestId: json.CheckoutRequestID ?? "",
      merchantRequestId: json.MerchantRequestID ?? "",
      reference,
      phone: formatPhone(phone),
      amount: 100,
    });

    return {
      checkoutRequestId: json.CheckoutRequestID ?? "",
      merchantRequestId: json.MerchantRequestID ?? "",
    };
  });

export const queryStk = createServerFn({ method: "POST" })
  .inputValidator((d: { checkoutRequestId: string }) => d)
  .handler(async (ctx): Promise<QueryResult> => {
    const { checkoutRequestId } = ctx.data;

    const stored = await getMpesaStatus(checkoutRequestId);
    if (stored) {
      return {
        ResultCode: stored.resultCode,
        ResultDesc: stored.resultDesc,
        pending: false,
      };
    }

    const CONSUMER_KEY    = process.env.MPESA_CONSUMER_KEY!;
    const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
    const PASSKEY         = process.env.MPESA_PASSKEY!;
    const SHORTCODE       = process.env.MPESA_SHORTCODE!;

    try {
      const token = await getToken(CONSUMER_KEY, CONSUMER_SECRET);
      const ts    = timestamp();
      const pwd   = mkPassword(SHORTCODE, PASSKEY, ts);

      const res = await fetch(
        "https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            BusinessShortCode: SHORTCODE,
            Password: pwd,
            Timestamp: ts,
            CheckoutRequestID: checkoutRequestId,
          }),
        }
      );

      // 500 from Daraja = still processing
      if (!res.ok) return { ResultCode: "", ResultDesc: "", pending: true };

      const json = await res.json() as {
        ResultCode?: string;
        ResultDesc?: string;
        errorCode?: string;
        errorMessage?: string;
      };

      // Daraja returns errorCode when transaction is still in progress
      if (json.errorCode) return { ResultCode: "", ResultDesc: "", pending: true };

      const desc = `${json.ResultDesc ?? ""} ${json.errorMessage ?? ""}`.toLowerCase();
      const stillProcessing =
        desc.includes("under processing") ||
        desc.includes("still processing") ||
        desc.includes("being processed") ||
        desc.includes("transaction is being");

      if (stillProcessing || !json.ResultCode) {
        return { ResultCode: "", ResultDesc: json.ResultDesc ?? "", pending: true };
      }

      await saveMpesaStatus({
        checkoutRequestId,
        resultCode: json.ResultCode,
        resultDesc: json.ResultDesc ?? "",
      });

      return {
        ResultCode: json.ResultCode ?? "",
        ResultDesc: json.ResultDesc ?? "",
        pending: false,
      };
    } catch {
      return { ResultCode: "", ResultDesc: "", pending: true };
    }
  });
