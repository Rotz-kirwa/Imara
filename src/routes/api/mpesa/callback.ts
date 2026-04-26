import { createFileRoute } from "@tanstack/react-router";
import { saveMpesaStatus } from "@/lib/mpesa-status";

type CallbackItem = {
  Name: string;
  Value?: string | number;
};

type MpesaCallbackBody = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: CallbackItem[];
      };
    };
  };
};

function getMetadataValue(items: CallbackItem[] | undefined, name: string) {
  return items?.find((item) => item.Name === name)?.Value;
}

export const Route = createFileRoute("/api/mpesa/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as MpesaCallbackBody | null;
        const callback = body?.Body?.stkCallback;

        if (!callback?.CheckoutRequestID || callback.ResultCode === undefined) {
          return Response.json(
            { ResultCode: 1, ResultDesc: "Invalid callback payload" },
            { status: 400 },
          );
        }

        const metadata = callback.CallbackMetadata?.Item;
        const amount = getMetadataValue(metadata, "Amount");
        const phoneNumber = getMetadataValue(metadata, "PhoneNumber");
        const transactionDate = getMetadataValue(metadata, "TransactionDate");
        const mpesaReceiptNumber = getMetadataValue(metadata, "MpesaReceiptNumber");

        await saveMpesaStatus({
          checkoutRequestId: callback.CheckoutRequestID,
          merchantRequestId: callback.MerchantRequestID,
          resultCode: String(callback.ResultCode),
          resultDesc: callback.ResultDesc ?? "",
          amount: typeof amount === "number" ? amount : undefined,
          phoneNumber: phoneNumber ? String(phoneNumber) : undefined,
          mpesaReceiptNumber: mpesaReceiptNumber ? String(mpesaReceiptNumber) : undefined,
          transactionDate: typeof transactionDate === "number" ? transactionDate : undefined,
          rawCallback: body,
        });

        return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
      },
    },
  },
});
