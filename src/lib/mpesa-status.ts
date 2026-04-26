import { sql } from "@/lib/db";

export type StoredMpesaStatus = {
  checkoutRequestId: string;
  merchantRequestId?: string;
  resultCode: string;
  resultDesc: string;
  phoneNumber?: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: number;
  reference?: string;
  rawCallback?: unknown;
};

type PaymentRow = {
  checkout_request_id: string;
  merchant_request_id: string | null;
  result_code: string | null;
  result_desc: string | null;
  phone: string | null;
  amount: string | number | null;
  mpesa_receipt_number: string | null;
  transaction_date: string | number | null;
  reference: string | null;
};

export async function createPendingMpesaPayment({
  checkoutRequestId,
  merchantRequestId,
  reference,
  phone,
  amount,
}: {
  checkoutRequestId: string;
  merchantRequestId: string;
  reference: string;
  phone: string;
  amount: number;
}) {
  const db = sql();
  await db`
    insert into mpesa_payments (
      checkout_request_id,
      merchant_request_id,
      reference,
      phone,
      amount,
      status
    )
    values (
      ${checkoutRequestId},
      ${merchantRequestId},
      ${reference},
      ${phone},
      ${amount},
      'pending'
    )
    on conflict (checkout_request_id) do update set
      merchant_request_id = excluded.merchant_request_id,
      reference = excluded.reference,
      phone = excluded.phone,
      amount = excluded.amount,
      status = 'pending',
      updated_at = now()
  `;
}

export async function saveMpesaStatus(status: StoredMpesaStatus) {
  const db = sql();
  const isSuccess = status.resultCode === "0";
  await db`
    insert into mpesa_payments (
      checkout_request_id,
      merchant_request_id,
      reference,
      phone,
      amount,
      mpesa_receipt_number,
      transaction_date,
      result_code,
      result_desc,
      raw_callback,
      status
    )
    values (
      ${status.checkoutRequestId},
      ${status.merchantRequestId ?? null},
      ${status.reference ?? null},
      ${status.phoneNumber ?? null},
      ${status.amount ?? null},
      ${status.mpesaReceiptNumber ?? null},
      ${status.transactionDate ?? null},
      ${status.resultCode},
      ${status.resultDesc},
      ${status.rawCallback ? JSON.stringify(status.rawCallback) : null},
      ${isSuccess ? "succeeded" : "failed"}
    )
    on conflict (checkout_request_id) do update set
      merchant_request_id = coalesce(excluded.merchant_request_id, mpesa_payments.merchant_request_id),
      reference = coalesce(excluded.reference, mpesa_payments.reference),
      phone = coalesce(excluded.phone, mpesa_payments.phone),
      amount = coalesce(excluded.amount, mpesa_payments.amount),
      mpesa_receipt_number = coalesce(excluded.mpesa_receipt_number, mpesa_payments.mpesa_receipt_number),
      transaction_date = coalesce(excluded.transaction_date, mpesa_payments.transaction_date),
      result_code = excluded.result_code,
      result_desc = excluded.result_desc,
      raw_callback = coalesce(excluded.raw_callback, mpesa_payments.raw_callback),
      status = excluded.status,
      updated_at = now()
  `;

  const reference = status.reference ?? await getPaymentReference(status.checkoutRequestId);
  if (reference) {
    await db`
      update loan_applications
      set
        status = ${isSuccess ? "payment_confirmed" : "payment_failed"},
        payment_confirmed_at = ${isSuccess ? new Date().toISOString() : null},
        updated_at = now()
      where reference = ${reference}
    `;
  }
}

export async function getMpesaStatus(checkoutRequestId: string) {
  const db = sql();
  const rows = await db`
    select
      checkout_request_id,
      merchant_request_id,
      result_code,
      result_desc,
      phone,
      amount,
      mpesa_receipt_number,
      transaction_date,
      reference
    from mpesa_payments
    where checkout_request_id = ${checkoutRequestId}
    limit 1
  ` as PaymentRow[];
  const row = rows[0];

  if (!row?.result_code) return undefined;

  return {
    checkoutRequestId: row.checkout_request_id,
    merchantRequestId: row.merchant_request_id ?? undefined,
    resultCode: row.result_code,
    resultDesc: row.result_desc ?? "",
    phoneNumber: row.phone ?? undefined,
    amount: row.amount === null ? undefined : Number(row.amount),
    mpesaReceiptNumber: row.mpesa_receipt_number ?? undefined,
    transactionDate: row.transaction_date === null ? undefined : Number(row.transaction_date),
    reference: row.reference ?? undefined,
  };
}

async function getPaymentReference(checkoutRequestId: string) {
  const db = sql();
  const rows = await db`
    select reference
    from mpesa_payments
    where checkout_request_id = ${checkoutRequestId}
    limit 1
  ` as Array<{ reference: string | null }>;

  return rows[0]?.reference ?? undefined;
}
