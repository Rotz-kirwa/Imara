import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  CheckCircle2, Zap, Loader2, ArrowRight, BadgeCheck, TrendingUp, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Check Eligibility — Vites" },
      { name: "description", content: "Find out in seconds if you qualify for a Vites loan. Fast, simple, and commitment-free." },
      { property: "og:title", content: "Check Loan Eligibility — Vites" },
      { property: "og:description", content: "30-second eligibility check. Instant personal offer." },
    ],
  }),
  component: EligibilityPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = { fullName: string; phone: string; idNumber: string };
type Errors   = Partial<Record<keyof FormData, string>>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateAmount(): number {
  // KSh 20,000 – 100,000 in KSh 500 steps — feels computed, not round
  return Math.round((Math.random() * 80_000 + 20_000) / 500) * 500;
}

function useCountUp(target: number, duration = 1800): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    setValue(0);
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

// ── Page ──────────────────────────────────────────────────────────────────────

function EligibilityPage() {
  const [data,    setData]    = useState<FormData>({ fullName: "", phone: "", idNumber: "" });
  const [errors,  setErrors]  = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [approved,setApproved]= useState(0);
  const [done,    setDone]    = useState(false);

  const update = (k: keyof FormData, v: string) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Errors = {};
    if (data.fullName.trim().length < 2)
      errs.fullName = "Please enter your full name";
    if (!/^(?:07|01)\d{8}$|^\+254\d{9}$/.test(data.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid Kenyan phone number (e.g. 0712 345 678)";
    if (!/^\d{7,9}$/.test(data.idNumber.trim()))
      errs.idNumber = "Enter a valid national ID number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setApproved(generateAmount());
    setLoading(false);
    setDone(true);
  };

  const reset = () => {
    setDone(false);
    setApproved(0);
    setData({ fullName: "", phone: "", idNumber: "" });
    setErrors({});
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-lg px-4 py-16 sm:px-6">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Eligibility check
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            See your offer instantly
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No credit impact. No commitment. Takes 30 seconds.
          </p>
        </div>

        {!done ? (
          <div className="rounded-3xl border bg-card p-6 shadow-elegant sm:p-10">
            {loading ? <LoadingState /> : (
              <form onSubmit={submit} className="space-y-5" noValidate>
                <Field
                  label="Full Name"
                  placeholder="Jane Achieng"
                  value={data.fullName}
                  onChange={v => update("fullName", v)}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <Field
                  label="Phone Number"
                  placeholder="0712 345 678"
                  type="tel"
                  value={data.phone}
                  onChange={v => update("phone", v)}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Field
                  label="National ID Number"
                  placeholder="12345678"
                  value={data.idNumber}
                  onChange={v => update("idNumber", v)}
                  error={errors.idNumber}
                />

                <button
                  type="submit"
                  className="btn-apply-hero mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-extrabold tracking-wide"
                >
                  Check My Eligibility
                  <Zap className="h-5 w-5" />
                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Your data is secure and never shared
                </p>
              </form>
            )}
          </div>
        ) : (
          <ResultCard
            amount={approved}
            firstName={data.fullName.split(" ")[0]}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

// ── Loading state ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex animate-fade-in-up flex-col items-center justify-center gap-4 py-12">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
      </div>
      <p className="font-semibold">Checking your eligibility…</p>
      <p className="text-sm text-muted-foreground">This will only take a moment</p>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({
  amount,
  firstName,
  onReset,
}: {
  amount: number;
  firstName: string;
  onReset: () => void;
}) {
  const count = useCountUp(amount, 1800);

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Approval card */}
      <div className="relative overflow-hidden rounded-3xl border border-success/25 bg-card shadow-elegant">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-success/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl" aria-hidden />

        <div className="relative p-8 text-center sm:p-10">
          {/* Checkmark */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-4 ring-success/20 shadow-[0_0_30px_theme(colors.success/0.25)]">
            <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={2} />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            You are eligible
          </span>

          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Congratulations{firstName ? `, ${firstName}` : ""}!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You have been pre-approved for
          </p>

          {/* Animated amount */}
          <div className="my-6 rounded-2xl bg-gradient-to-br from-primary/8 via-accent/5 to-success/8 px-6 py-7 ring-1 ring-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Approved Amount
            </p>
            <p className="mt-2 font-display text-5xl font-black gradient-text sm:text-6xl">
              KSh {count.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            You qualify for a loan of{" "}
            <span className="font-semibold text-foreground">
              KSh {amount.toLocaleString()}
            </span>
            . Proceed below to complete your application.
          </p>
        </div>
      </div>

      {/* Proceed CTA */}
      <Link
        to="/apply"
        className="btn-apply-hero group inline-flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-extrabold tracking-wide"
      >
        Proceed to Apply
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap,       label: "Instant disbursement" },
          { icon: BadgeCheck,label: "No collateral needed" },
          { icon: TrendingUp,label: "Flexible repayment"   },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3 text-center shadow-card"
          >
            <Icon className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Not you?{" "}
        <button onClick={onReset} className="font-semibold text-primary hover:underline">
          Start over
        </button>
      </p>
    </div>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, error, type = "text", placeholder, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full rounded-xl border bg-background px-4 py-3.5 text-sm outline-none transition-all focus:ring-4 ${
          error
            ? "border-destructive focus:ring-destructive/15"
            : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      />
      {error && (
        <span className="mt-1.5 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}
