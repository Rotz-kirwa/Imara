import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Smartphone, Zap, Shield, TrendingUp, Clock, Wallet, CheckCircle2,
  ArrowRight, Star, Users, BadgeCheck, Sparkles
} from "lucide-react";
import heroImg from "@/assets/hero-vites.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vites — Get Instant Loans Straight to Your Phone" },
      { name: "description", content: "Fast approval, flexible repayment, transparent fees. Apply for a Vites loan in minutes and receive funds directly to your mobile money." },
      { property: "og:title", content: "Vites — Instant Mobile Loans" },
      { property: "og:description", content: "Money in your phone in minutes. Trusted by thousands across Africa." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Benefits />
      <LoanFeatures />
      <Testimonials />
      <FaqPreview />
      <CtaBanner />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Happy young woman in Nairobi smiling at her phone after receiving a Vites loan"
          className="h-full w-full object-cover"
          width={1600}
          height={1200}
        />
        {/* Layered overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent lg:from-background/60 lg:via-background/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-accent/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-28 lg:pb-40">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            50,000+ customers
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Loans, <span className="gradient-text">straight to your phone</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-foreground/80 sm:text-lg">
            Approved in seconds. Funded in minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/eligibility"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3.5 text-sm font-semibold backdrop-blur shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant hover:bg-card"
            >
              Check Eligibility
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/apply"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              Apply Now
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute left-4 bottom-8 animate-float rounded-2xl glass p-4 shadow-card sm:left-auto sm:right-8 sm:bottom-16 lg:right-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-sm font-semibold">KSh 50,000</p>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-8 hidden animate-float rounded-2xl glass p-4 shadow-card sm:block lg:top-16" style={{ animationDelay: "1.5s" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Funded in</p>
              <p className="text-sm font-semibold">2 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { icon: Users, value: "50K+", label: "Active customers" },
    { icon: Wallet, value: "KSh 2B+", label: "Disbursed" },
    { icon: Clock, value: "< 5 min", label: "Average approval" },
    { icon: Star, value: "4.8/5", label: "Customer rating" },
  ];
  return (
    <section className="border-y bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <s.icon className="h-7 w-7 text-primary" />
            <div>
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Smartphone, title: "Check eligibility", desc: "Answer a few quick questions to see your offer instantly." },
    { icon: CheckCircle2, title: "Apply in minutes", desc: "Fill a simple form. No paperwork, no branch visits." },
    { icon: Zap, title: "Get approved fast", desc: "Our smart engine reviews and approves in seconds." },
    { icon: Wallet, title: "Receive funds", desc: "Money lands in your mobile wallet, ready to use." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How it works"
        title="From application to cash in 4 simple steps"
        subtitle="A loan process designed for the speed of mobile life."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="hover-lift group relative rounded-2xl border bg-card p-6 shadow-card"
          >
            <div className="absolute -top-3 right-5 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-primary-foreground">
              0{i + 1}
            </div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
              <step.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Zap, title: "Lightning-fast approval", desc: "Decisions in under 60 seconds powered by intelligent scoring." },
    { icon: TrendingUp, title: "Flexible repayment", desc: "Choose terms that fit your income, from 7 days to 12 months." },
    { icon: Shield, title: "Bank-grade security", desc: "256-bit encryption and biometric protection on every login." },
    { icon: BadgeCheck, title: "Transparent pricing", desc: "No hidden fees. See your exact cost before you accept." },
  ];
  return (
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Vites"
          title="Built for trust. Designed for speed."
          subtitle="Everything you need from a modern lender — and nothing you don't."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((b) => (
            <div key={b.title} className="hover-lift flex gap-5 rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <b.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoanFeatures() {
  const tiers = [
    { name: "Starter", amount: "KSh 1K – 20K", rate: "From 4%", term: "7–30 days", color: "from-primary/20 to-accent/10" },
    { name: "Growth", amount: "KSh 20K – 100K", rate: "From 3%", term: "1–6 months", color: "from-accent/20 to-success/10", featured: true },
    { name: "Premium", amount: "KSh 100K – 500K", rate: "From 2%", term: "3–12 months", color: "from-success/20 to-primary/10" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Loan products"
        title="A loan for every season of life"
        subtitle="Whether it's a quick top-up or a major investment, we've got an option."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`hover-lift relative overflow-hidden rounded-3xl border bg-card p-7 shadow-card ${t.featured ? "ring-2 ring-primary" : ""}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-50`} aria-hidden />
            <div className="relative">
              {t.featured && (
                <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <p className="mt-2 text-3xl font-bold gradient-text">{t.amount}</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Interest {t.rate}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {t.term} repayment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Instant disbursement</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> No collateral</li>
              </ul>
              <Link
                to="/apply"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:-translate-y-0.5"
              >
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Amina K.", role: "Boutique owner, Nairobi", quote: "I got my stock loan approved in 3 minutes. Vites literally saved my business that week." },
    { name: "Brian O.", role: "Boda boda rider", quote: "No bank would talk to me. With Vites I bought a second motorbike and doubled my income." },
    { name: "Wanjiru M.", role: "Teacher", quote: "Transparent fees, friendly app. I always know exactly what I'll pay back. No surprises." },
  ];
  return (
    <section className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Real customers"
          title="Trusted by thousands across Africa"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="hover-lift rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqPreview() {
  const faqs = [
    { q: "How fast will I get the money?", a: "Most approved loans are disbursed to your mobile wallet within 2 minutes." },
    { q: "What do I need to apply?", a: "Just your national ID, phone number, and active mobile money account." },
    { q: "Is my data safe?", a: "Yes. We use 256-bit encryption and never share your information without consent." },
  ];
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="FAQ" title="Questions? We've got answers." />
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:shadow-elegant">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold list-none">
              {f.q}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
        <div className="pt-4 text-center">
          <Link to="/faq" className="text-sm font-semibold text-primary hover:underline">
            See all FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-center shadow-elegant sm:p-16">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 50%)" }} />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready for your loan?
          </h2>
          <p className="mt-3 text-primary-foreground/80">Check your eligibility in less than 60 seconds.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/eligibility"
              className="rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5"
            >
              Check Eligibility
            </Link>
            <Link
              to="/apply"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-white/20"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
