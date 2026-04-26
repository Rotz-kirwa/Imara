import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Check Eligibility — Vites" },
      { name: "description", content: "Find out in 60 seconds how much you qualify for with Vites. No impact on your credit score." },
      { property: "og:title", content: "Check Loan Eligibility — Vites" },
      { property: "og:description", content: "60-second eligibility check. Instant offer." },
    ],
  }),
  component: EligibilityPage,
});

type FormData = {
  fullName: string;
  phone: string;
  income: string;
  employment: string;
  loanAmount: string;
  repayment: string;
};

const STEPS = [
  { key: "fullName", label: "What's your name?", placeholder: "e.g. Jane Achieng", type: "text" },
  { key: "phone", label: "Your phone number", placeholder: "+254 700 000 000", type: "tel" },
  { key: "income", label: "Monthly income (KSh)", placeholder: "30000", type: "number" },
] as const;

function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    fullName: "", phone: "", income: "", employment: "", loanAmount: "", repayment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const update = (k: keyof FormData, v: string) => setData((d) => ({ ...d, [k]: v }));

  const validate = (): boolean => {
    setError("");
    if (step === 0 && data.fullName.trim().length < 2) { setError("Please enter your full name"); return false; }
    if (step === 1 && !/^[+\d\s()-]{7,}$/.test(data.phone)) { setError("Please enter a valid phone number"); return false; }
    if (step === 2 && (!data.income || Number(data.income) < 1000)) { setError("Please enter your monthly income"); return false; }
    if (step === 3 && !data.employment) { setError("Please select your employment status"); return false; }
    if (step === 4 && (!data.loanAmount || Number(data.loanAmount) < 500)) { setError("Please enter a loan amount"); return false; }
    if (step === 5 && !data.repayment) { setError("Please select a repayment period"); return false; }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step === totalSteps - 1) { setSubmitted(true); return; }
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setSubmitted(false);
    setData({ fullName: "", phone: "", income: "", employment: "", loanAmount: "", repayment: "" });
  };

  const income = Number(data.income) || 0;
  const requested = Number(data.loanAmount) || 0;
  const maxEligible = Math.min(income * 3, 500000);
  const eligible = income >= 10000 && requested <= maxEligible;
  const offered = Math.min(requested, maxEligible);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Eligibility check</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">See your offer in 60 seconds</h1>
          <p className="mt-2 text-sm text-muted-foreground">No credit impact. No commitment.</p>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-elegant sm:p-10">
          {!submitted ? (
            <>
              <div className="mb-8">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Step {step + 1} of {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div key={step} className="animate-fade-in-up">
                {step <= 2 && (
                  <Field
                    label={STEPS[step].label}
                    type={STEPS[step].type}
                    placeholder={STEPS[step].placeholder}
                    value={data[STEPS[step].key as keyof FormData]}
                    onChange={(v) => update(STEPS[step].key as keyof FormData, v)}
                  />
                )}
                {step === 3 && (
                  <Choice
                    label="Employment status"
                    options={["Employed", "Self-employed", "Business owner", "Student", "Other"]}
                    value={data.employment}
                    onChange={(v) => update("employment", v)}
                  />
                )}
                {step === 4 && (
                  <Field
                    label="How much would you like to borrow? (KSh)"
                    type="number"
                    placeholder="50000"
                    value={data.loanAmount}
                    onChange={(v) => update("loanAmount", v)}
                  />
                )}
                {step === 5 && (
                  <Choice
                    label="Preferred repayment period"
                    options={["7 days", "30 days", "3 months", "6 months", "12 months"]}
                    value={data.repayment}
                    onChange={(v) => update("repayment", v)}
                  />
                )}

                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium disabled:opacity-30 hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  {step === totalSteps - 1 ? "See result" : "Continue"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center animate-fade-in-up">
              {eligible ? (
                <>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">You're eligible! 🎉</h2>
                  <p className="mt-2 text-muted-foreground">
                    Congratulations {data.fullName.split(" ")[0]}, here's your pre-approved offer.
                  </p>
                  <div className="my-8 rounded-2xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground shadow-elegant">
                    <p className="text-sm opacity-80">Estimated offer up to</p>
                    <p className="font-display text-5xl font-bold">KSh {offered.toLocaleString()}</p>
                    <p className="mt-2 text-sm opacity-80">Repayment: {data.repayment}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      to="/apply"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5"
                    >
                      Continue to Application <Sparkles className="h-4 w-4" />
                    </Link>
                    <button onClick={reset} className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted">
                      Start over
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <h2 className="font-display text-3xl font-bold">Not quite yet</h2>
                  <p className="mt-3 text-muted-foreground">
                    Based on your details, we recommend a smaller amount or building your repayment history first.
                    {requested > maxEligible && ` You may be eligible for up to KSh ${maxEligible.toLocaleString()}.`}
                  </p>
                  <button onClick={reset} className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:-translate-y-0.5 transition-all">
                    Try again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
    </label>
  );
}

function Choice({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all hover:-translate-y-0.5 ${
              value === opt
                ? "border-primary bg-primary/10 text-foreground shadow-card"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
