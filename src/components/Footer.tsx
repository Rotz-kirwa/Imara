import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t bg-gradient-to-b from-background to-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-card">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="gradient-text">Apex Finance</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Instant mobile loans designed for the modern African. Fast, secure, and built around your life.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { label: "X", href: "#" },
                { label: "FB", href: "#" },
                { label: "IG", href: "#" },
                { label: "in", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/eligibility" className="hover:text-foreground">Eligibility Check</Link></li>
              <li><Link to="/apply" className="hover:text-foreground">Apply for Loan</Link></li>
              <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Apex Finance. All rights reserved.</p>
          <p>Built with ❤️ for Africa</p>
        </div>
      </div>
    </footer>
  );
}
