import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { stkPush, queryStk } from "@/lib/mpesa";
import { saveLoanApplication } from "@/lib/applications";
import {
  CheckCircle2, Sparkles, Loader2, Zap,
  Smartphone, Shield,
  TrendingUp, DollarSign, ArrowUpRight, PiggyBank,
} from "lucide-react";

type PaymentPhase = "notice" | "stk" | "flow";
type StkResponse = Awaited<ReturnType<typeof stkPush>>;

const stkRequests = new Map<string, Promise<StkResponse>>();

function getStkRequest(phone: string, reference: string, forceNew = false) {
  const key = `${reference}:${phone.replace(/\s/g, "")}`;
  if (forceNew) stkRequests.delete(key);

  const current = stkRequests.get(key);
  if (current) return current;

  const request = stkPush({ data: { phone, reference } }).catch((error) => {
    stkRequests.delete(key);
    throw error;
  });
  stkRequests.set(key, request);
  return request;
}

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan — Vites" },
      { name: "description", content: "Complete your Vites loan application in minutes. Funds disbursed to your mobile wallet upon approval." },
      { property: "og:title", content: "Apply for a Loan — Vites" },
      { property: "og:description", content: "Quick application. Fast funding." },
    ],
  }),
  component: ApplyPage,
});

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName:  z.string().trim().min(2, "First name is required"),
  lastName:   z.string().trim().min(2, "Last name is required"),
  idNumber:   z.string().trim().regex(/^\d{7,9}$/, "Enter a valid national ID number"),
  phone:      z.string().trim().regex(/^(?:07|01)\d{8}$|^\+?254\d{9}$/, "Enter a valid Kenyan phone number"),
  loanAmount: z.string().min(1, "Select a loan amount"),
  income:     z.coerce.number().min(1000, "Enter your monthly income"),
  employment: z.string().min(1, "Select employment status"),
  loanTerm:   z.string().min(1, "Select loan term"),
});

type FormState = Record<keyof z.infer<typeof schema>, string>;
type Errors    = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  firstName: "", lastName: "", idNumber: "", phone: "",
  loanAmount: "", income: "", employment: "", loanTerm: "",
};

const LOAN_AMOUNTS = [
  "KSh 10,000", "KSh 25,000", "KSh 50,000", "KSh 75,000",
  "KSh 100,000", "KSh 150,000", "KSh 200,000", "KSh 250,000",
  "KSh 500,000", "KSh 1,000,000",
];

// ── Page ──────────────────────────────────────────────────────────────────────

function ApplyPage() {
  const [data,         setData]         = useState<FormState>(initial);
  const [errors,       setErrors]       = useState<Errors>({});
  const [loading,      setLoading]      = useState(false);
  const [done,         setDone]         = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("notice");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [phoneError,   setPhoneError]   = useState("");
  const [refNum]                        = useState(() => `VTS-${Date.now().toString().slice(-8)}`);

  const set = (k: keyof FormState, v: string) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach(i => { errs[i.path[0] as keyof FormState] = i.message; });
      setErrors(errs);
      const first = document.querySelector<HTMLElement>("[data-field]");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      await saveLoanApplication({
        data: {
          reference: refNum,
          ...data,
        },
      });
      setPaymentPhone(data.phone);
      setPaymentPhase("notice");
      setDone(true);
    } catch {
      setErrors({ phone: "We could not save your application. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Post-submission payment flow ─────────────────────────────────────────────

  if (done) {
    const sendStk = () => {
      const clean = paymentPhone.replace(/\s/g, "");
      if (!/^(?:07|01)\d{8}$|^\+254\d{9}$/.test(clean)) {
        setPhoneError("Enter a valid Kenyan phone number");
        return;
      }
      setPhoneError("");
      setPaymentPhase("stk");
    };

    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.88_0.11_285),transparent_38%),linear-gradient(145deg,oklch(0.98_0.01_250),oklch(0.94_0.025_235))] dark:bg-[radial-gradient(circle_at_50%_0%,oklch(0.32_0.09_285),transparent_42%),linear-gradient(145deg,var(--background),oklch(0.18_0.035_265))]" />
        <div className="absolute inset-x-6 top-14 mx-auto h-44 max-w-xl rounded-full bg-primary/15 blur-3xl" />

        <div className="relative mx-auto max-w-lg px-4 py-14 sm:py-20">

          {paymentPhase === "notice" && (
            <div className="animate-fade-in-up">
              <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_28px_80px_-36px_oklch(0.3_0.16_265/0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-card/90">
                <div className="bg-gradient-to-r from-success/12 via-primary/10 to-accent/12 px-6 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-success ring-1 ring-success/15 dark:bg-background/70">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Application submitted
                  </span>
                  <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Ref {refNum}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold leading-tight">
                        Authorize your M-Pesa payment
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Pay the refundable facilitation fee to unlock your loan review and
                        disbursement.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border bg-secondary/45 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Refundable fee
                      </p>
                      <p className="mt-1 font-display text-3xl font-black gradient-text">
                        KSh 100
                      </p>
                    </div>
                    <span className="rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success ring-1 ring-success/20">
                      100% refundable
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-foreground">
                      M-Pesa Phone Number
                    </span>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={e => { setPaymentPhone(e.target.value); setPhoneError(""); }}
                        placeholder="0712 345 678"
                        className={`h-14 w-full rounded-2xl border bg-background pl-11 pr-4 text-base font-semibold outline-none transition-all focus:ring-4 ${
                          phoneError
                            ? "border-destructive focus:ring-destructive/15"
                            : "border-input focus:border-primary focus:ring-primary/15"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <span className="mt-1.5 block text-xs text-destructive">{phoneError}</span>
                    )}
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={sendStk}
                      className="btn-apply-hero relative inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-base font-extrabold tracking-wide"
                    >
                      Unlock Your Loan
                      <Zap className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs font-medium text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-success" />
                    Secure M-Pesa payment · KSh 100 only
                  </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentPhase === "stk" && (
            <StkPending
              phone={paymentPhone}
              reference={refNum}
              onSuccess={() => setPaymentPhase("flow")}
            />
          )}

          {paymentPhase === "flow" && <LoanStatusFlow />}
        </div>
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/60 dark:from-background dark:via-primary/5 dark:to-accent/5" />
      <div className="absolute inset-0 gradient-mesh opacity-25" />

      {/* Decorative finance icons — desktop only */}
      <div className="pointer-events-none absolute -left-8 top-32 hidden rotate-[-15deg] opacity-[0.07] lg:block">
        <TrendingUp className="h-72 w-72 text-primary" />
      </div>
      <div className="pointer-events-none absolute -right-8 bottom-24 hidden rotate-[12deg] opacity-[0.07] lg:block">
        <PiggyBank className="h-64 w-64 text-success" />
      </div>
      <div className="pointer-events-none absolute right-24 top-20 hidden rotate-[6deg] opacity-[0.05] xl:block">
        <ArrowUpRight className="h-48 w-48 text-accent" />
      </div>
      <div className="pointer-events-none absolute left-1/4 bottom-16 hidden -rotate-[8deg] opacity-[0.05] xl:block">
        <DollarSign className="h-40 w-40 text-primary" />
      </div>

      <div className="relative mx-auto max-w-xl px-4 py-16 sm:px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
            Loan Application
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details below — takes less than 2 minutes.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border/60 bg-white shadow-xl dark:bg-card">
          <form onSubmit={submit} className="space-y-5 p-7 sm:p-9" noValidate>

            <Field
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={set}
              error={errors.firstName}
              placeholder="Jane"
            />
            <Field
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={set}
              error={errors.lastName}
              placeholder="Achieng"
            />
            <Field
              label="ID Number"
              name="idNumber"
              value={data.idNumber}
              onChange={set}
              error={errors.idNumber}
              placeholder="12345678"
            />
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={set}
              error={errors.phone}
              placeholder="0712 345 678"
            />
            <SelectField
              label="Loan Amount"
              name="loanAmount"
              value={data.loanAmount}
              onChange={set}
              error={errors.loanAmount}
              options={LOAN_AMOUNTS}
            />
            <Field
              label="Monthly Income (KSh)"
              name="income"
              type="number"
              value={data.income}
              onChange={set}
              error={errors.income}
              placeholder="e.g. 30000"
            />
            <SelectField
              label="Employment Status"
              name="employment"
              value={data.employment}
              onChange={set}
              error={errors.employment}
              options={["Employed", "Self-employed", "Business owner", "Student", "Retired", "Other"]}
            />
            <SelectField
              label="Loan Term (Months)"
              name="loanTerm"
              value={data.loanTerm}
              onChange={set}
              error={errors.loanTerm}
              options={["1 Month", "3 Months", "6 Months", "12 Months"]}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg disabled:opacity-70"
            >
              {loading
                ? <span className="inline-flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</span>
                : "Submit Application"
              }
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to our Terms and authorize Vites to assess your application.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── STK Pending ───────────────────────────────────────────────────────────────

type StkPhase = "initiating" | "waiting" | "error";

function StkPending({
  phone,
  reference,
  onSuccess,
}: {
  phone: string;
  reference: string;
  onSuccess: () => void;
}) {
  const [phase,     setPhase]     = useState<StkPhase>("initiating");
  const [errorMsg,  setErrorMsg]  = useState("");
  const checkoutId = useRef<string | null>(null);

  useEffect(() => {
    getStkRequest(phone, reference)
      .then(({ checkoutRequestId }) => {
        checkoutId.current = checkoutRequestId;
        setPhase("waiting");
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : "Failed to send payment request");
        setPhase("error");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (phase !== "waiting") return;

    const FRIENDLY: Record<string, string> = {
      "1032": "Payment cancelled. Please try again.",
      "1":    "Insufficient M-Pesa balance.",
      "1037": "Request timed out. Please try again.",
      "2001": "Incorrect M-Pesa PIN.",
    };

    const interval = setInterval(async () => {
      if (!checkoutId.current) return;
      try {
        const result = await queryStk({ data: { checkoutRequestId: checkoutId.current } });
        if (result.pending) return;
        if (result.ResultCode === "0") {
          clearInterval(interval);
          onSuccessRef.current();
        } else if (result.ResultCode) {
          clearInterval(interval);
          setErrorMsg(FRIENDLY[result.ResultCode] ?? result.ResultDesc ?? "Payment failed.");
          setPhase("error");
        }
      } catch { /* Network hiccup — keep polling */ }
    }, 4000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setErrorMsg("The M-Pesa prompt timed out. Please request a new prompt and try again.");
      setPhase("error");
    }, 180_000);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase]);

  const retry = () => {
    setPhase("initiating");
    setErrorMsg("");
    checkoutId.current = null;
    getStkRequest(phone, reference, true)
      .then(({ checkoutRequestId }) => { checkoutId.current = checkoutRequestId; setPhase("waiting"); })
      .catch((e: unknown) => { setErrorMsg(e instanceof Error ? e.message : "Failed"); setPhase("error"); });
  };

  if (phase === "error") {
    return (
      <div className="animate-fade-in-up flex flex-col items-center gap-5 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 ring-4 ring-destructive/20">
          <span className="text-3xl">⚠️</span>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-destructive">Payment issue</h2>
          <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
        </div>
        <button
          onClick={retry}
          className="btn-apply-hero rounded-full px-6 py-3 text-sm font-bold tracking-wide"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up flex flex-col items-center gap-6 py-8 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-4 ring-primary/20">
          <Smartphone className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div>
        {phase === "initiating" ? (
          <>
            <h2 className="font-display text-2xl font-bold">Sending prompt…</h2>
            <p className="mt-2 text-sm text-muted-foreground">Connecting to M-Pesa. Please wait.</p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold">Check your phone 📲</h2>
            <p className="mt-2 text-muted-foreground">
              An M-Pesa payment prompt of{" "}
              <span className="font-semibold text-foreground">KSh 100</span> has been sent to{" "}
              <span className="font-semibold text-foreground">{phone}</span>.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Enter your M-Pesa PIN to proceed.</p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {phase === "initiating" ? "Sending payment request…" : "Waiting for payment confirmation…"}
      </div>
    </div>
  );
}

// ── Payment Confirmed ─────────────────────────────────────────────────────────

function LoanStatusFlow() {
  return (
    <div className="animate-fade-in-up">
      <div className="rounded-3xl border border-success/25 bg-card p-8 text-center shadow-elegant">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-4 ring-success/20 shadow-[0_0_32px_oklch(0.68_0.16_165/0.3)]">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>

        <h2 className="font-display text-2xl font-bold">
          🎉 Payment confirmed!
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your application has moved to the final stage. We’re processing your
          loan now — you’ll receive an update shortly.
        </p>

        <a
          href="/"
          className="btn-apply-hero mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-sm font-bold tracking-wide"
        >
          Done — Go Home
          <Sparkles className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// ── Form field components ─────────────────────────────────────────────────────

function Field({
  label, name, value, onChange, error, type = "text", placeholder,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (k: keyof FormState, v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label data-field={name} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} <span className="text-destructive">*</span>
      </span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-4 ${
          error
            ? "border-destructive focus:ring-destructive/15"
            : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      />
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SelectField({
  label, name, value, onChange, error, options,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (k: keyof FormState, v: string) => void;
  error?: string;
  options: string[];
}) {
  return (
    <label data-field={name} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} <span className="text-destructive">*</span>
      </span>
      <select
        value={value}
        onChange={e => onChange(name, e.target.value)}
        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-4 ${
          error
            ? "border-destructive focus:ring-destructive/15"
            : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
