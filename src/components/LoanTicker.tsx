import { useMemo } from "react";
import { CheckCircle2, Zap, Wallet } from "lucide-react";

type IconKey = "check" | "zap" | "wallet";
type TickerEvent = { message: string; icon: IconKey };

const PREFIXES = [
  "0700", "0701", "0702", "0703", "0710", "0711", "0712", "0713",
  "0720", "0721", "0722", "0723", "0724", "0725", "0726", "0729",
  "0730", "0731", "0732", "0733", "0740", "0741", "0750", "0751",
  "0790", "0791", "0792", "0793", "0110", "0111", "0112", "0114",
];

const AMOUNTS = [
  15000, 18000, 20000, 25000, 30000, 35000, 40000,
  45000, 50000, 60000, 75000, 80000, 100000,
];

const ICONS: IconKey[] = ["check", "zap", "wallet"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makePhone(): string {
  const prefix = pick(PREFIXES);
  const last3 = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}***${last3}`;
}

function makeEvent(): TickerEvent {
  const phone = makePhone();
  const amount = pick(AMOUNTS);
  const fmt = `KSh ${amount.toLocaleString()}`;
  const icon = pick(ICONS);

  const messages = [
    `${phone} just received ${fmt}`,
    `${phone} approved for ${fmt}`,
    `${phone} just got ${fmt}`,
    `${phone} funded with ${fmt}`,
    `${phone} approved in 2 min – ${fmt}`,
    `${phone} loan of ${fmt} disbursed`,
    `${phone} received ${fmt} in 90 sec`,
    `${phone} qualified for ${fmt}`,
  ];

  return { message: pick(messages), icon };
}

const IconMap: Record<IconKey, typeof CheckCircle2> = {
  check: CheckCircle2,
  zap: Zap,
  wallet: Wallet,
};

export function LoanTicker() {
  // Generated once per mount — each page load has unique random messages
  const events = useMemo<TickerEvent[]>(() => Array.from({ length: 16 }, makeEvent), []);
  const doubled = [...events, ...events];

  return (
    <div className="ticker-container flex items-stretch border-b bg-gradient-to-r from-primary/[0.07] via-secondary/60 to-accent/[0.07]">
      {/* LIVE badge */}
      <div className="z-10 flex shrink-0 items-center border-r bg-background/70 px-3 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Live
        </span>
      </div>

      {/* Scrolling track */}
      <div className="relative min-w-0 flex-1 overflow-hidden py-2.5">
        {/* Right fade-out edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-ticker flex w-max">
          {doubled.map((ev, i) => (
            <TickerItem key={i} message={ev.message} icon={ev.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TickerItem({ message, icon }: TickerEvent) {
  const Icon = IconMap[icon];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap px-5 text-sm font-medium text-foreground/75">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      {message}
      <span className="mx-1 text-border" aria-hidden>•</span>
    </span>
  );
}
