"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, HardDrive, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { knowledge, people } from "@/data/mock";
import { KnowledgeArticle } from "@/features/knowledge/articles";
import type { Ticket } from "@/types";
import { slaState } from "@/lib/service-desk";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MetricStrip, PageHeader, Panel, ToneBadge } from "@/features/portal/shared";
import { TicketRows } from "@/features/tickets/components";

const slaMinutes = (value: string) => { const match = value.match(/^(\d+):(\d+)$/); return match ? Number(match[1]) * 60 + Number(match[2]) : Infinity; };

export function Dashboard({ tickets, onTicket, onCreate, onAllTickets }: { tickets: Ticket[]; onTicket: (ticket: Ticket) => void; onCreate: () => void; onAllTickets: () => void }) {
  const open = tickets.filter(ticket => !["Resolved", "Closed"].includes(ticket.status));
  const risks = open.filter(ticket => slaState(ticket).risk).sort((a, b) => slaMinutes(a.sla) - slaMinutes(b.sla));
  const recent = [...tickets].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);
  return <>
    <PageHeader eyebrow="IT Operations" title="Good morning, Nattapon" description="Service Desk overview · sample records" actions={<Button onClick={onCreate}><Plus className="size-4" />Create Ticket</Button>} />
    <MetricStrip items={[["Open Tickets", String(open.length), "Sample records"], ["SLA At Risk", String(risks.length), "Under 2 hours"], ["Unassigned", String(open.filter(ticket => ticket.assignee === "Unassigned").length), "Needs triage"], ["Resolved", String(tickets.filter(ticket => ticket.status === "Resolved").length), "Sample records"]]} />
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><Panel title="Tickets Trend" description="Illustrative activity · 7 days"><div className="flex h-56 items-end gap-3 p-5">{[38, 52, 44, 68, 57, 82, 64].map((height, index) => <div key={index} className="flex h-full flex-1 items-end gap-1 border-b"><span style={{ height: `${height}%` }} className="w-1/2 rounded-t bg-primary" /><span style={{ height: `${Math.max(20, height - 18)}%` }} className="w-1/2 rounded-t bg-emerald-400" /></div>)}</div></Panel><Panel title="SLA At Risk" description="Tickets approaching breach"><div className="divide-y">{risks.length ? risks.slice(0, 3).map(ticket => <button key={ticket.id} onClick={() => onTicket(ticket)} className="w-full p-4 text-left hover:bg-muted/50"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-semibold text-primary">{ticket.id}</p><p className="mt-1 line-clamp-2 text-sm font-medium">{ticket.title}</p></div><strong className="font-mono text-sm text-amber-600">{ticket.sla}</strong></div><Progress className="mt-3 h-1.5" value={slaMinutes(ticket.sla) < 30 ? 88 : 68} /></button>) : <p className="p-5 text-sm text-muted-foreground">No tickets near their SLA in the sample data.</p>}</div></Panel></div>
    <div className="mt-6"><Panel title="Recent Tickets" description="Latest activity across the sample service desk" action={<Button variant="ghost" size="sm" onClick={onAllTickets}>View all</Button>}><TicketRows rows={recent} onOpen={onTicket} /></Panel></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Panel title="Technician Workload"><div className="divide-y">{["Nattapon Wongchai", "Krit Sutham", "Mali Charoen"].map(name => { const assigned = open.filter(ticket => ticket.assignee === name); return <div key={name} className="flex items-center gap-3 p-4"><Avatar><AvatarFallback>{name.split(" ").map(part => part[0]).join("")}</AvatarFallback></Avatar><div className="flex-1"><p className="font-medium">{name}</p><p className="text-xs text-muted-foreground">IT Support</p></div><span className="text-sm"><strong>{assigned.length}</strong> open</span></div>; })}</div></Panel><Panel title="Asset Health"><div className="grid grid-cols-4 gap-px bg-border">{[["In Use", "984"], ["In Stock", "176"], ["Repair", "23"], ["Warranty", "31"]].map(([label, value]) => <div key={label} className="bg-card p-4"><small className="text-muted-foreground">{label}</small><p className="text-2xl font-semibold">{value}</p></div>)}</div><div className="m-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"><AlertTriangle className="mr-2 inline size-4" />5 assets have 3+ repairs this year.</div></Panel></div>
  </>;
}

export function InventoryPage() {
  const rows = [["CAB-C6-2M", "CAT6 Network Cable 2m", "Network", "84", "20", "Bangkok Store", "Healthy"], ["SSD-NV-1T", "NVMe SSD 1TB", "Storage", "7", "10", "Bangkok Store", "Low Stock"], ["BAT-DL-54", "Dell 54Wh Battery", "Parts", "0", "5", "Service Center", "Out of Stock"], ["MSE-WL-01", "Wireless Mouse", "Peripherals", "42", "15", "Chiang Mai", "Healthy"]];
  return <><PageHeader title="Inventory" description="Stock visibility for equipment, consumables, and spare parts." actions={<Button onClick={() => toast.info("Inventory editing is planned for the next phase")}><Plus className="size-4" />Add Item</Button>} /><MetricStrip items={[["Total Items", "2,486", "186 SKUs"], ["Low Stock", "12", "Needs reorder"], ["Out of Stock", "4", "Action required"], ["Stock Value", "฿1.84M", "Across 3 locations"]]} /><Panel title="Inventory Items" className="mt-6"><div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr>{["SKU", "Item", "Category", "Stock", "Minimum", "Location", "Status"].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y">{rows.map(row => <tr key={row[0]}>{row.map((value, index) => <td key={index} className="px-4 py-3">{index === 6 ? <ToneBadge value={value} /> : value}</td>)}</tr>)}</tbody></table></div></Panel></>;
}

export function SoftwarePage() {
  const rows = [["Microsoft 365", 150, 143, "Dec 2026"], ["Adobe Creative Cloud", 42, 39, "Mar 2027"], ["AutoCAD", 18, 14, "Jan 2027"], ["CrowdStrike", 1250, 1211, "Nov 2026"]] as const;
  return <><PageHeader title="Software & Licenses" description="Seat utilization, assignment, and renewal planning." actions={<Button onClick={() => toast.info("Software editing is planned for the next phase")}><Plus className="size-4" />Add Software</Button>} /><div className="grid gap-4 md:grid-cols-2">{rows.map(([name, total, assigned, expiration]) => <section key={name} className="rounded-xl border bg-card p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-secondary"><HardDrive className="size-5 text-primary" /></span><div><h2 className="font-semibold">{name}</h2><p className="text-xs text-muted-foreground">Expires {expiration}</p></div></div><div className="mt-5 flex justify-between text-sm"><span>{assigned} assigned</span><span>{total - assigned} available</span></div><Progress className="mt-2 h-2" value={assigned / total * 100} /></section>)}</div></>;
}

export function UsersPage() {
  return <><PageHeader title="Users" description="Employees, assigned assets, and service history." actions={<Button onClick={() => toast.info("User editing is planned for the next phase")}><Plus className="size-4" />Add User</Button>} /><Panel title="Directory"><div className="divide-y">{people.map(person => <div key={person.id} className="grid items-center gap-3 p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto_auto]"><div className="flex items-center gap-3"><Avatar><AvatarFallback>{person.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</AvatarFallback></Avatar><div><p className="font-medium">{person.name}</p><p className="text-xs text-muted-foreground">{person.nameTh || person.email}</p></div></div><span>{person.department}</span><span>{person.role}</span><span>{person.assets} assets</span><ToneBadge value={person.status} /></div>)}</div></Panel></>;
}

export function KnowledgePage() {
  const [query, setQuery] = useState("");
  const found = knowledge.filter(article => `${article.title} ${article.category} ${article.description} ${article.keywords.join(" ")}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <><div className="mb-7 rounded-2xl border bg-card py-8 text-center"><BookOpen className="mx-auto size-8 text-primary" /><h1 className="mt-3 text-3xl font-semibold">Knowledge Base</h1><p className="mt-2 text-sm text-muted-foreground">Try a guide before creating a ticket.</p><div className="relative mx-auto mt-5 max-w-xl px-4"><Search className="absolute left-8 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search Knowledge Base" value={query} onChange={event => setQuery(event.target.value)} className="h-12 pl-12" placeholder="Search Knowledge Base" /></div></div><p className="mb-4 text-sm text-muted-foreground">{found.length} {found.length === 1 ? "guide" : "guides"} · Demo content</p><div className="grid gap-4 md:grid-cols-2">{found.map(article => <KnowledgeArticle key={article.title} article={article} />)}{!found.length && <p className="text-sm text-muted-foreground">No guides match your search. Try another term or create a ticket.</p>}</div></>;
}

export function ReportsPage() {
  return <><PageHeader title="Reports" description="Service Desk, SLA, asset, inventory, and software insights." actions={<>{["CSV", "Excel", "PDF"].map(format => <Button key={format} variant="outline" onClick={() => toast.info(`${format} export is a UI mock in this phase`)}>{format}</Button>)}</>} /><div className="grid gap-6 lg:grid-cols-2"><Panel title="Ticket Trend" description="Illustrative created vs resolved activity"><div className="h-64 p-6"><svg viewBox="0 0 500 190" className="h-full w-full" role="img" aria-label="Illustrative ticket trend"><path d="M10 160C70 145 80 90 145 110S220 155 270 85S355 35 410 75S455 95 490 30" fill="none" stroke="#1746a2" strokeWidth="5" /><path d="M10 175C70 165 95 135 145 145S230 120 270 125S355 80 410 105S460 65 490 72" fill="none" stroke="#34b67a" strokeWidth="4" strokeDasharray="7 7" /></svg></div></Panel><Panel title="SLA Compliance" description="Illustrative target 95%"><div className="grid h-64 place-items-center"><div className="grid size-40 place-items-center rounded-full" style={{ background: "conic-gradient(#1746a2 96%,var(--muted) 0)" }}><div className="grid size-28 place-items-center rounded-full bg-card text-center"><strong className="text-3xl">96%</strong></div></div></div></Panel></div></>;
}
