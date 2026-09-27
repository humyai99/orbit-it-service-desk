"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const styles: Record<string, string> = {
  "P1 Critical": "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
  "P2 High": "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
  "P3 Medium": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  "P4 Low": "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  "In Progress": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  "In Use": "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  Waiting: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  Repair: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  "Out of Stock": "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
};

export function ToneBadge({ value }: { value: string }) {
  return <Badge variant="outline" className={styles[value] ?? "border-border bg-muted text-muted-foreground"}>{value}</Badge>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>{eyebrow && <p className="mb-1 text-sm text-muted-foreground">{eyebrow}</p>}<h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>{description && <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>}</div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>;
}

export function MetricStrip({ items }: { items: [string, string, string][] }) {
  return <div className="grid border-y border-border sm:grid-cols-2 xl:grid-cols-4">{items.map(([label, value, meta], index) => <div key={label} className={`px-1 py-5 sm:px-5 ${index ? "sm:border-l sm:border-border" : ""}`}><p className="text-sm text-muted-foreground">{label}</p><div className="mt-2 flex items-end gap-3"><strong className="text-3xl font-semibold tabular-nums">{value}</strong><span className="pb-1 text-xs text-muted-foreground">{meta}</span></div></div>)}</div>;
}

export function Panel({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-xl border border-border bg-card ${className}`}><div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 className="font-semibold">{title}</h2>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>{action}</div>{children}</section>;
}

export function EmptyState({ title, description, onClear }: { title: string; description: string; onClear?: () => void }) {
  return <div className="grid min-h-60 place-items-center p-8 text-center"><div><div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-muted"><Search className="size-5 text-muted-foreground" /></div><h3 className="font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>{onClear && <Button onClick={onClear} variant="outline" size="sm" className="mt-4">Clear filters</Button>}</div></div>;
}
