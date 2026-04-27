import postgres from "postgres";

type CallbackItem = { Name: string; Value?: string | number };
type MpesaCallbackBody = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: CallbackItem[] };
    };
  };
};

function meta(items: CallbackItem[] | undefined, name: string) {
  return items?.find((i) => i.Name === name)?.Value;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = (await request.json().catch(() => null)) as MpesaCallbackBody | null;
    const cb = body?.Body?.stkCallback;

    if (!cb?.CheckoutRequestID || cb.ResultCode === undefined) {
      return Response.json({ ResultCode: 1, ResultDesc: "Invalid payload" }, { status: 400 });
    }

    const items = cb.CallbackMetadata?.Item;
    const amount     = meta(items, "Amount");
    const phone      = meta(items, "PhoneNumber");
    const receiptNo  = meta(items, "MpesaReceiptNumber");
    const txDate     = meta(items, "TransactionDate");
    const isSuccess  = cb.ResultCode === 0;

    const url = process.env.DATABASE_URL;
    if (!url) return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const sql = postgres(url, { ssl: "require", max: 1 });
    try {
      await sql`
        insert into mpesa_payments (
          checkout_request_id, merchant_request_id, phone, amount,
          mpesa_receipt_number, transaction_date, result_code, result_desc,
          raw_callback, status
        )
        values (
          ${cb.CheckoutRequestID},
          ${cb.MerchantRequestID ?? null},
          ${phone ? String(phone) : null},
          ${typeof amount === "number" ? amount : null},
          ${receiptNo ? String(receiptNo) : null},
          ${typeof txDate === "number" ? txDate : null},
          ${String(cb.ResultCode)},
          ${cb.ResultDesc ?? ""},
          ${JSON.stringify(body)},
          ${isSuccess ? "succeeded" : "failed"}
        )
        on conflict (checkout_request_id) do update set
          result_code = excluded.result_code,
          result_desc = excluded.result_desc,
          mpesa_receipt_number = coalesce(excluded.mpesa_receipt_number, mpesa_payments.mpesa_receipt_number),
          amount = coalesce(excluded.amount, mpesa_payments.amount),
          raw_callback = excluded.raw_callback,
          status = excluded.status,
          updated_at = now()
      `;

      if (isSuccess) {
        await sql`
          update loan_applications
          set status = 'payment_confirmed',
              payment_confirmed_at = now(),
              updated_at = now()
          where reference = (
            select reference from mpesa_payments
            where checkout_request_id = ${cb.CheckoutRequestID}
            limit 1
          )
        `;
      }
    } finally {
      await sql.end();
    }

    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err);
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
