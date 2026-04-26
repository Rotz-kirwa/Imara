import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Sparkles, Loader2, ArrowLeft, ArrowRight, Zap, Rocket, Crown, CheckCircle } from "lucide-react";

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

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  idNumber: z.string().trim().min(5, "Valid ID number required").max(20),
  phone: z.string().trim().regex(/^[+\d\s()-]{7,}$/, "Valid phone number required"),
  email: z.string().trim().email("Valid email required").max(255),
  location: z.string().trim().min(2, "Location is required").max(100),
  employment: z.string().min(1, "Select employment status"),
  income: z.coerce.number().min(1000, "Enter your monthly income"),
  loanAmount: z.coerce.number().min(500, "Enter loan amount").max(1000000),
  repayment: z.string().min(1, "Select repayment period"),
  purpose: z.string().trim().min(3, "Please describe purpose").max(500),
});

type FormState = Record<keyof z.infer<typeof schema>, string>;
type Errors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  fullName: "", idNumber: "", phone: "", email: "", location: "",
  employment: "", income: "", loanAmount: "", repayment: "", purpose: "",
};

type Pkg = {
  id: string;
  name: string;
  range: string;
  min: number;
  max: number;
  defaultAmount: number;
  rate: string;
  term: string;
  perks: string[];
  icon: typeof Zap;
  gradient: string;
  ring: string;
  badge?: string;
};

const PACKAGES: Pkg[] = [
  {
    id: "starter",
    name: "Quick Boost",
    range: "KSh 10,000 – 50,000",
    min: 10000, max: 50000, defaultAmount: 25000,
    rate: "From 4% / month",
    term: "1 – 3 months",
    perks: ["Instant disbursement", "No collateral", "Mobile-money payout"],
    icon: Zap,
    gradient: "from-amber-400 via-orange-500 to-pink-500",
    ring: "ring-amber-400",
  },
  {
    id: "growth",
    name: "Growth Plan",
    range: "KSh 51,000 – 100,000",
    min: 51000, max: 100000, defaultAmount: 75000,
    rate: "From 3% / month",
    term: "3 – 6 months",
    perks: ["Lower interest rate", "Flexible repayment", "Priority approval"],
    icon: Rocket,
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
    ring: "ring-indigo-400",
    badge: "Most popular",
  },
  {
    id: "premium",
    name: "Premium Capital",
    range: "KSh 101,000 – 1,000,000",
    min: 101000, max: 1000000, defaultAmount: 250000,
    rate: "From 2% / month",
    term: "6 – 12 months",
    perks: ["Best rates", "Dedicated agent", "Up to 12-month term"],
    icon: Crown,
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    ring: "ring-teal-400",
  },
];

function ApplyPage() {
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as keyof FormState] = i.message; });
      setErrors(errs);
      const first = document.querySelector(`[data-field="${Object.keys(errs)[0]}"]`);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-primary-foreground shadow-glow">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="font-display text-4xl font-bold">Application received! 🎉</h1>
          <p className="mt-3 text-muted-foreground">
            Thanks {data.fullName.split(" ")[0]} — we're reviewing your application now.
            You'll get an SMS at <span className="font-semibold text-foreground">{data.phone}</span> within minutes.
          </p>
          <div className="mt-8 rounded-2xl border bg-card p-6 text-left shadow-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Reference</p>
            <p className="font-mono text-lg font-bold gradient-text">VTS-{Date.now().toString().slice(-8)}</p>
          </div>
          <button
            onClick={() => { setDone(false); setData(initial); }}
            className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:-translate-y-0.5 transition-all"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Loan application</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Apply for your Vites loan</h1>
          <p className="mt-2 text-sm text-muted-foreground">All fields are required. It only takes 2 minutes.</p>
        </div>

        <form onSubmit={submit} className="space-y-6 rounded-3xl border bg-card p-6 shadow-elegant sm:p-10">
          <Section title="Personal information">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Full name" name="fullName" value={data.fullName} onChange={set} error={errors.fullName} placeholder="Jane Achieng" />
              <Input label="National ID number" name="idNumber" value={data.idNumber} onChange={set} error={errors.idNumber} placeholder="12345678" />
              <Input label="Phone number" name="phone" type="tel" value={data.phone} onChange={set} error={errors.phone} placeholder="+254 700 000 000" />
              <Input label="Email address" name="email" type="email" value={data.email} onChange={set} error={errors.email} placeholder="jane@example.com" />
              <Input label="Location" name="location" value={data.location} onChange={set} error={errors.location} placeholder="Nairobi, Kenya" />
              <Select label="Employment status" name="employment" value={data.employment} onChange={set} error={errors.employment}
                options={["Employed", "Self-employed", "Business owner", "Student", "Other"]} />
            </div>
          </Section>

          <Section title="Loan details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Monthly income (KSh)" name="income" type="number" value={data.income} onChange={set} error={errors.income} placeholder="30000" />
              <Input label="Loan amount (KSh)" name="loanAmount" type="number" value={data.loanAmount} onChange={set} error={errors.loanAmount} placeholder="50000" />
              <Select label="Repayment period" name="repayment" value={data.repayment} onChange={set} error={errors.repayment}
                options={["7 days", "30 days", "3 months", "6 months", "12 months"]} />
              <Textarea label="Purpose of loan" name="purpose" value={data.purpose} onChange={set} error={errors.purpose} placeholder="e.g. Restocking my shop" />
            </div>
          </Section>

          <div className="flex flex-col items-center gap-4 border-t pt-6 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground sm:max-w-xs">
              By submitting, you agree to our Terms and authorize Vites to assess your application.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-70 sm:w-auto"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Application <Sparkles className="h-4 w-4" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, name, value, onChange, error, type = "text", placeholder }: {
  label: string; name: keyof FormState; value: string; onChange: (k: keyof FormState, v: string) => void;
  error?: string; type?: string; placeholder?: string;
}) {
  return (
    <label data-field={name} className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-4 ${
          error ? "border-destructive focus:ring-destructive/15" : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Select({ label, name, value, onChange, error, options }: {
  label: string; name: keyof FormState; value: string; onChange: (k: keyof FormState, v: string) => void;
  error?: string; options: string[];
}) {
  return (
    <label data-field={name} className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-4 ${
          error ? "border-destructive focus:ring-destructive/15" : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Textarea({ label, name, value, onChange, error, placeholder }: {
  label: string; name: keyof FormState; value: string; onChange: (k: keyof FormState, v: string) => void;
  error?: string; placeholder?: string;
}) {
  return (
    <label data-field={name} className="block sm:col-span-2">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all focus:ring-4 ${
          error ? "border-destructive focus:ring-destructive/15" : "border-input focus:border-primary focus:ring-primary/15"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
