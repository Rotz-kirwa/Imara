import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Apex Finance" },
      { name: "description", content: "Answers to common questions about Apex Finance loans, eligibility, repayment, and security." },
      { property: "og:title", content: "Apex Finance FAQ" },
      { property: "og:description", content: "Everything you need to know about Apex Finance loans." },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    section: "Getting started",
    items: [
      { q: "What is Apex Finance?", a: "Apex Finance is a mobile-first lending platform that delivers instant loans straight to your phone — designed for the speed and reality of African daily life." },
      { q: "Who can apply?", a: "Anyone over 18 with a valid national ID, an active mobile money account, and a steady source of income." },
      { q: "How long does approval take?", a: "Most loans are approved in under 60 seconds and disbursed within 2 minutes." },
    ],
  },
  {
    section: "Loans & repayment",
    items: [
      { q: "How much can I borrow?", a: "Loans range from KSh 1,000 to KSh 500,000, depending on your income and repayment history." },
      { q: "What are the interest rates?", a: "Rates start from 2% per month and depend on the loan size, term, and your credit profile. The exact cost is shown upfront — no hidden fees." },
      { q: "How do I repay?", a: "Repayment is simple via mobile money. We send reminders before each due date, and you can repay early without penalty." },
      { q: "What if I can't pay on time?", a: "Reach out to us through the app. We offer flexible restructuring options to help you stay on track." },
    ],
  },
  {
    section: "Security & privacy",
    items: [
      { q: "Is my data safe?", a: "Yes. We use 256-bit encryption, biometric login, and never share your information with third parties without consent." },
      { q: "Is Apex Finance licensed?", a: "Yes. Apex Finance is fully licensed and regulated as a digital credit provider." },
    ],
  },
];

function FaqPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Help center</p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-3 text-muted-foreground">Quick answers to the questions our customers ask most.</p>
        </div>

        <div className="mt-12 space-y-10">
          {FAQS.map((sec) => (
            <div key={sec.section}>
              <h2 className="mb-4 font-display text-xl font-bold">{sec.section}</h2>
              <div className="space-y-3">
                {sec.items.map((f) => (
                  <details key={f.q} className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:shadow-elegant">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold list-none">
                      {f.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center text-primary-foreground shadow-elegant">
          <h3 className="font-display text-2xl font-bold">Still have questions?</h3>
          <p className="mt-2 opacity-90">Our team is here to help, 7 days a week.</p>
          <Link to="/apply" className="mt-6 inline-block rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:-translate-y-0.5 transition-all">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
