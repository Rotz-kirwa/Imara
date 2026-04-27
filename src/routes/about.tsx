import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Zap, TrendingUp, BadgeCheck, Users, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Apex Finance" },
      { name: "description", content: "Learn about Apex Finance — our mission to make fast, fair credit accessible to every African." },
      { property: "og:title", content: "About Apex Finance" },
      { property: "og:description", content: "Built for Africa. Powered by technology. Driven by trust." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" aria-hidden />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our story</p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Built for Africa.{" "}
          <span className="gradient-text">Powered by trust.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Apex Finance was founded with a single belief: access to fast, fair credit should not be a privilege.
          We build technology that puts money in your hands in minutes — not days — so you can seize every opportunity life brings.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">What drives us</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Our values</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Customer first",
                desc: "Every decision we make starts with one question: does this make life easier for our customers?",
              },
              {
                icon: BadgeCheck,
                title: "Radical transparency",
                desc: "No hidden fees, no fine print surprises. You see your exact cost before you accept — always.",
              },
              {
                icon: Shield,
                title: "Trust & security",
                desc: "256-bit encryption and rigorous data privacy standards protect your information at every step.",
              },
              {
                icon: Zap,
                title: "Speed matters",
                desc: "Opportunities don't wait. Neither do we. Most loans are approved in under 60 seconds.",
              },
              {
                icon: TrendingUp,
                title: "Built to grow with you",
                desc: "As you build a repayment history with us, your credit limit grows — rewarding responsible borrowing.",
              },
              {
                icon: Users,
                title: "Community impact",
                desc: "When our customers thrive — businesses expand, families are supported, communities prosper.",
              },
            ].map((v) => (
              <div key={v.title} className="hover-lift rounded-2xl border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">By the numbers</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">The impact so far</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "50,000+", label: "Customers served" },
            { value: "KSh 2B+", label: "Disbursed to date" },
            { value: "< 2 min", label: "Average disbursement" },
            { value: "4.8 / 5", label: "Customer satisfaction" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-8 text-center shadow-card">
              <p className="font-display text-4xl font-black gradient-text">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">The team</p>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">People behind Apex Finance</h2>
            <p className="mt-4 text-muted-foreground">
              A diverse team of fintech engineers, credit experts, and customer advocates — united by the mission to democratize credit across Africa.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Sarah Wambui", role: "CEO & Co-Founder", initial: "S" },
              { name: "David Otieno", role: "CTO & Co-Founder", initial: "D" },
              { name: "Fatuma Hassan", role: "Head of Credit Risk", initial: "F" },
              { name: "James Kariuki", role: "Head of Product", initial: "J" },
              { name: "Aisha Ndungu", role: "Head of Customer Success", initial: "A" },
              { name: "Peter Mwangi", role: "Head of Engineering", initial: "P" },
            ].map((m) => (
              <div key={m.name} className="hover-lift flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-card">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
                  {m.initial}
                </div>
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-10 text-center shadow-elegant sm:p-16">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 50%)" }} />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to experience Apex Finance?
            </h2>
            <p className="mt-3 text-primary-foreground/80">Check your eligibility in less than 60 seconds — no commitment required.</p>
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
    </div>
  );
}
