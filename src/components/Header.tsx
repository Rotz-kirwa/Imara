import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/apply", label: "Apply" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-card">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="gradient-text">Vites</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/eligibility"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Check Eligibility
            </Link>
            <Link
              to="/apply"
              className="btn-apply rounded-full px-5 py-2.5 text-sm font-bold tracking-wide"
            >
              Apply Now
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 text-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/apply"
                onClick={() => setOpen(false)}
                className="btn-apply mt-2 rounded-full px-5 py-2.5 text-center text-sm font-bold tracking-wide"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
