"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { knowledge } from "@/data/mock";
import { ToneBadge } from "@/features/portal/shared";

export function matchingArticles(query: string, category = "") {
  const terms = `${query} ${category}`.toLocaleLowerCase().split(/\s+/).filter(term => term.length > 2);
  if (!terms.length) return [];
  return knowledge.map(article => ({ article, score: terms.filter(term => `${article.title} ${article.category} ${article.description} ${article.keywords.join(" ")}`.toLocaleLowerCase().includes(term)).length }))
    .filter(result => result.score > 0).sort((a, b) => b.score - a.score).map(result => result.article);
}

export function KnowledgeArticle({ article, compact = false }: { article: typeof knowledge[number]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return <article className="rounded-xl border bg-card p-4 sm:p-5"><button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)} className="flex w-full items-start justify-between gap-4 text-left"><div><div className="mb-2 flex items-center gap-2"><BookOpen className="size-4 text-primary" /><ToneBadge value={article.category} /></div><h3 className="font-semibold">{article.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{article.description}</p>{!compact && <p className="mt-2 text-xs text-muted-foreground">{article.views} views · {article.updated}</p>}</div>{open ? <ChevronUp className="mt-1 size-4 shrink-0" /> : <ChevronDown className="mt-1 size-4 shrink-0" />}</button>{open && <div className="mt-4 border-t pt-4"><p className="mb-3 text-sm font-medium">Try these steps</p><ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{article.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="mt-4 text-xs text-muted-foreground">Demo guide only. If the issue continues, create a ticket for IT support.</p></div>}</article>;
}
