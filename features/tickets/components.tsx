"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, CircleHelp, HardDrive, Laptop, Network, Paperclip, Plus, Printer, Search, Send, ShieldCheck, Upload, Wrench } from "lucide-react";
import { toast } from "sonner";
import { assets } from "@/data/mock";
import type { NewTicketInput, Ticket, TicketEvent, TicketMessage, TicketStatus } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, MetricStrip, PageHeader, Panel, ToneBadge } from "@/features/portal/shared";

export type TicketPreset = "all" | "mine" | "unassigned" | "sla" | "p1p2" | "waiting";

const statuses: TicketStatus[] = ["New", "Assigned", "In Progress", "Waiting", "Resolved", "Closed"];
const technicians = ["Nattapon Wongchai", "Krit Sutham", "Mali Charoen", "Unassigned"];
const pageSize = 5;
const priorityRank: Record<string, number> = { "P1 Critical": 1, "P2 High": 2, "P3 Medium": 3, "P4 Low": 4 };

function slaMinutes(sla: string) {
  const match = sla.match(/^(\d+):(\d+)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : Number.POSITIVE_INFINITY;
}

export function TicketRows({ rows, onOpen }: { rows: Ticket[]; onOpen: (ticket: Ticket) => void }) {
  if (!rows.length) return <EmptyState title="No tickets found" description="Try a different search or clear the filters." />;
  return <>
    <div className="divide-y divide-border md:hidden">{rows.map(ticket => <button key={ticket.id} onClick={() => onOpen(ticket)} className="w-full p-4 text-left hover:bg-muted/50"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-semibold text-primary">{ticket.id}</p><p className="mt-1 font-medium">{ticket.title}</p></div><ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" /></div><div className="mt-3 flex flex-wrap items-center gap-2"><ToneBadge value={ticket.priority} /><ToneBadge value={ticket.status} /><span className="text-xs text-muted-foreground">{ticket.requester}</span></div></button>)}</div>
    <div className="hidden overflow-x-auto md:block"><Table className="min-w-[950px]"><TableHeader className="bg-muted/60"><TableRow>{["Ticket", "Title", "Requester", "Category", "Priority", "Status", "Assignee", "SLA", "Updated"].map(label => <TableHead key={label} className="text-xs uppercase tracking-wide">{label}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map(ticket => <TableRow key={ticket.id} onClick={() => onOpen(ticket)} tabIndex={0} onKeyDown={event => { if (event.key === "Enter") onOpen(ticket); }} className="cursor-pointer hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"><TableCell className="font-mono text-xs font-semibold text-primary">{ticket.id}</TableCell><TableCell className="max-w-64 truncate font-medium">{ticket.title}</TableCell><TableCell>{ticket.requester}</TableCell><TableCell>{ticket.category}</TableCell><TableCell><ToneBadge value={ticket.priority} /></TableCell><TableCell><ToneBadge value={ticket.status} /></TableCell><TableCell>{ticket.assignee}</TableCell><TableCell className="font-mono text-xs">{ticket.sla}</TableCell><TableCell className="text-muted-foreground">{ticket.updated}</TableCell></TableRow>)}</TableBody></Table></div>
  </>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="min-w-32"><SelectValue placeholder={label} /></SelectTrigger><SelectContent><SelectItem value="all">All {label}</SelectItem>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}

export function TicketsPage({ tickets, preset, onOpen, onCreate }: { tickets: Ticket[]; preset: TicketPreset; onOpen: (ticket: Ticket) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<TicketPreset>(preset);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  useEffect(() => { setQuick(preset); setPage(1); }, [preset]);
  const categories = [...new Set(tickets.map(ticket => ticket.category))].sort();
  const departments = [...new Set(tickets.map(ticket => ticket.department))].sort();
  const assignees = [...new Set(tickets.map(ticket => ticket.assignee))].sort();
  const clear = () => { setQuery(""); setQuick("all"); setStatus("all"); setPriority("all"); setCategory("all"); setAssignee("all"); setDepartment("all"); setPage(1); };
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const result = tickets.filter(ticket => {
      if (q && ![ticket.id, ticket.title, ticket.requester, ticket.category, ticket.department, ticket.assignee].join(" ").toLocaleLowerCase().includes(q)) return false;
      if (status !== "all" && ticket.status !== status) return false;
      if (priority !== "all" && ticket.priority !== priority) return false;
      if (category !== "all" && ticket.category !== category) return false;
      if (assignee !== "all" && ticket.assignee !== assignee) return false;
      if (department !== "all" && ticket.department !== department) return false;
      if (quick === "mine" && ticket.assignee !== "Nattapon Wongchai") return false;
      if (quick === "unassigned" && ticket.assignee !== "Unassigned") return false;
      if (quick === "sla" && (slaMinutes(ticket.sla) >= 120 || ["Resolved", "Closed"].includes(ticket.status))) return false;
      if (quick === "p1p2" && !["P1 Critical", "P2 High"].includes(ticket.priority)) return false;
      if (quick === "waiting" && ticket.status !== "Waiting") return false;
      return true;
    });
    return result.sort((a, b) => sort === "oldest" ? a.id.localeCompare(b.id) : sort === "priority" ? priorityRank[a.priority] - priorityRank[b.priority] || b.id.localeCompare(a.id) : sort === "title" ? a.title.localeCompare(b.title) : b.id.localeCompare(a.id));
  }, [tickets, query, quick, status, priority, category, assignee, department, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const setFilter = (setter: (v: string) => void) => (value: string) => { setter(value); setPage(1); };
  const quicks: [TicketPreset, string][] = [["mine", "My Tickets"], ["unassigned", "Unassigned"], ["sla", "SLA Risk"], ["p1p2", "P1/P2"], ["waiting", "Waiting"]];
  return <>
    <PageHeader title="Tickets" description="Track incidents, requests, assignments, and SLA performance." actions={<Button onClick={onCreate}><Plus className="size-4" />Create Ticket</Button>} />
    <div className="mb-4 flex flex-wrap gap-2"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search tickets" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} className="pl-9" placeholder="Search ticket number, title, requester…" /></div><FilterSelect label="Status" value={status} options={statuses} onChange={setFilter(setStatus)} /><FilterSelect label="Priority" value={priority} options={Object.keys(priorityRank)} onChange={setFilter(setPriority)} /><FilterSelect label="Category" value={category} options={categories} onChange={setFilter(setCategory)} /><FilterSelect label="Assignee" value={assignee} options={assignees} onChange={setFilter(setAssignee)} /><FilterSelect label="Department" value={department} options={departments} onChange={setFilter(setDepartment)} /></div>
    <div className="mb-4 flex flex-wrap items-center gap-2"><Button size="sm" variant={quick === "all" ? "secondary" : "ghost"} onClick={() => { setQuick("all"); setPage(1); }}>All Tickets</Button>{quicks.map(([value, label]) => <Button key={value} size="sm" variant={quick === value ? "secondary" : "ghost"} onClick={() => { setQuick(value); setPage(1); }}>{label}</Button>)}<Button size="sm" variant="ghost" onClick={clear} className="ml-auto text-muted-foreground">Clear filters</Button></div>
    <Panel title={`${filtered.length} ${filtered.length === 1 ? "Ticket" : "Tickets"}`} description="Click a row to open details" action={<Select value={sort} onValueChange={value => { setSort(value); setPage(1); }}><SelectTrigger aria-label="Sort tickets"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="oldest">Oldest first</SelectItem><SelectItem value="priority">Highest priority</SelectItem><SelectItem value="title">Title A–Z</SelectItem></SelectContent></Select>}>
      {filtered.length ? <TicketRows rows={visible} onOpen={onOpen} /> : <EmptyState title="No tickets found" description="No tickets match the current search and filters." onClear={clear} />}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground"><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="size-4" />Previous</Button><span className="tabular-nums">{currentPage} / {pageCount}</span><Button size="sm" variant="outline" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight className="size-4" /></Button></div></div>
    </Panel>
  </>;
}

function MessageCard({ message }: { message: TicketMessage }) {
  return <div className={`rounded-xl border p-5 ${message.visibility === "internal" ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30" : "bg-card"}`}><div className="flex gap-3"><Avatar><AvatarFallback>{message.author.split(" ").map(part => part[0]).join("").slice(0, 2)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{message.author}</strong><ToneBadge value={message.visibility === "internal" ? "Internal note" : message.role} /><span className="text-xs text-muted-foreground">{message.time}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{message.body}</p></div></div></div>;
}

export function TicketDetail({ ticket, messages, events, onBack, onAsset, onStatus, onAssign, onMessage }: { ticket: Ticket; messages: TicketMessage[]; events: TicketEvent[]; onBack: () => void; onAsset: (id: string) => void; onStatus: (status: TicketStatus) => void; onAssign: (name: string) => void; onMessage: (body: string, visibility: "public" | "internal") => void }) {
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const send = (visibility: "public" | "internal") => { const body = (visibility === "public" ? reply : note).trim(); if (!body) { toast.error(`Write ${visibility === "public" ? "a reply" : "an internal note"} first`); return; } onMessage(body, visibility); if (visibility === "public") setReply(""); else setNote(""); toast.success(visibility === "public" ? "Reply added" : "Internal note added"); };
  const publicMessages = messages.filter(message => message.visibility === "public");
  const internalMessages = messages.filter(message => message.visibility === "internal");
  const resolutionComplete = ticket.sla === "Completed";
  const resolutionAtRisk = !resolutionComplete && slaMinutes(ticket.sla) < 120;
  const resolutionProgress = resolutionComplete ? 100 : resolutionAtRisk ? 72 : 24;
  return <>
    <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to tickets</button>
    <PageHeader eyebrow={ticket.id} title={ticket.title} actions={<><ToneBadge value={ticket.priority} /><ToneBadge value={ticket.status} /></>} />
    <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4"><div className="min-w-44"><label className="mb-1 block text-xs font-medium text-muted-foreground">Assigned to</label><Select value={ticket.assignee} onValueChange={onAssign}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{technicians.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div><div className="min-w-40"><label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label><Select value={ticket.status} onValueChange={value => onStatus(value as TicketStatus)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{statuses.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="ml-auto text-right"><p className="text-xs text-muted-foreground">Resolution SLA</p><p className={`font-mono text-lg font-semibold ${slaMinutes(ticket.sla) < 120 ? "text-amber-600" : "text-foreground"}`}>{ticket.sla === "Completed" ? "Completed" : `${ticket.sla}:32`}</p></div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="min-w-0"><Panel title="Description"><p className="p-5 text-sm leading-7 text-muted-foreground">{ticket.description}</p>{ticket.attachments?.length ? <div className="mx-5 mb-5 flex flex-wrap gap-2">{ticket.attachments.map(name => <span key={name} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"><Paperclip className="size-3" />{name}</span>)}</div> : null}</Panel>
      <Tabs defaultValue="conversation" className="mt-6"><TabsList className="flex h-auto w-full flex-wrap justify-start"><TabsTrigger value="conversation">Conversation ({publicMessages.length})</TabsTrigger><TabsTrigger value="notes">Internal Notes ({internalMessages.length})</TabsTrigger><TabsTrigger value="work">Work Logs</TabsTrigger><TabsTrigger value="timeline">Timeline</TabsTrigger><TabsTrigger value="related">Related</TabsTrigger></TabsList>
        <TabsContent value="conversation"><div className="mt-4 space-y-4">{publicMessages.map(message => <MessageCard key={message.id} message={message} />)}<div className="rounded-xl border bg-card p-4"><label htmlFor="ticket-reply" className="mb-2 block text-sm font-medium">Reply to requester</label><Textarea id="ticket-reply" value={reply} onChange={event => setReply(event.target.value)} placeholder="Write your reply…" className="min-h-28" /><div className="mt-3 flex justify-end"><Button onClick={() => send("public")}><Send className="size-4" />Send Reply</Button></div></div></div></TabsContent>
        <TabsContent value="notes"><div className="mt-4 space-y-4"><div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"><ShieldCheck className="mr-2 inline size-4" />Only IT staff can see internal notes.</div>{internalMessages.map(message => <MessageCard key={message.id} message={message} />)}<div className="rounded-xl border bg-card p-4"><label htmlFor="internal-note" className="mb-2 block text-sm font-medium">Internal note</label><Textarea id="internal-note" value={note} onChange={event => setNote(event.target.value)} placeholder="Add context for the support team…" className="min-h-24" /><div className="mt-3 flex justify-end"><Button onClick={() => send("internal")}>Add Note</Button></div></div></div></TabsContent>
        <TabsContent value="work"><div className="mt-4 rounded-xl border bg-card p-5"><p className="font-medium">Diagnostics and recovery</p><p className="mt-1 text-sm text-muted-foreground">Nattapon · 25 minutes · Today 10:12</p></div></TabsContent>
        <TabsContent value="timeline"><div className="mt-4 rounded-xl border bg-card p-5"><ol className="space-y-5 border-l border-border pl-5">{events.map(event => <li key={event.id} className="relative"><span className="absolute -left-[25px] top-2 size-2 rounded-full bg-primary" /><span className="text-xs text-muted-foreground">{event.time}</span><p className="text-sm font-medium">{event.label}</p></li>)}</ol></div></TabsContent>
        <TabsContent value="related"><EmptyState title="No related tickets" description="Related incidents can be linked in a later phase." /></TabsContent>
      </Tabs></div><aside className="space-y-5"><Panel title="Ticket Information"><dl className="divide-y text-sm">{[["Requester", ticket.requester], ["Department", ticket.department], ["Category", ticket.category], ["Asset", ticket.asset ?? "None"], ["Priority", ticket.priority], ["Assigned To", ticket.assignee], ["Location", ticket.location], ["Created", ticket.created]].map(([key, value]) => <div key={key} className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted-foreground">{key}</dt><dd className="text-right font-medium">{key === "Asset" && ticket.asset ? <button className="text-primary hover:underline" onClick={() => onAsset(ticket.asset!)}>{value}</button> : value}</dd></div>)}</dl></Panel><Panel title="SLA"><div className="space-y-5 p-5"><div><div className="flex justify-between text-sm"><span>Response SLA</span><span className="text-emerald-600">Completed</span></div><Progress value={100} className="mt-2 h-2" /></div><div><div className="flex justify-between text-sm"><span>Resolution SLA</span><span className={`font-mono ${resolutionAtRisk ? "text-amber-600" : "text-foreground"}`}>{ticket.sla}</span></div><Progress value={resolutionProgress} className="mt-2 h-2" /><p className={`mt-2 text-xs ${resolutionAtRisk ? "text-amber-600" : "text-muted-foreground"}`}>{resolutionComplete ? "Completed" : resolutionAtRisk ? "At Risk · 72% elapsed" : "On track · 24% elapsed"}</p></div></div></Panel></aside></div>
  </>;
}

const categories = [[Laptop, "Computer / Notebook"], [Network, "Network / Internet"], [Printer, "Printer"], [Send, "Email"], [HardDrive, "Software"], [ShieldCheck, "Account / Access"], [Wrench, "Hardware"], [CircleHelp, "Other"]] as const;
const problems: Record<string, string[]> = {
  "Computer / Notebook": ["Computer won't start", "Slow computer", "Blue screen", "Application issue", "Battery issue", "Other"],
  "Network / Internet": ["Cannot connect", "Slow connection", "Wi-Fi disconnects", "VPN issue", "Other"],
  Printer: ["Cannot print", "Paper jam", "Poor print quality", "Printer offline", "Other"],
  Email: ["Cannot sign in", "Cannot send or receive", "Mailbox full", "Other"],
  Software: ["Installation", "License issue", "Application error", "Other"],
  "Account / Access": ["Locked account", "Access request", "Password reset", "Other"],
  Hardware: ["Damaged device", "Peripheral issue", "Replacement request", "Other"],
  Other: ["General request", "Other"],
};

export function CreateTicket({ open, onClose, onSubmit, onView, seedAssetId }: { open: boolean; onClose: () => void; onSubmit: (input: NewTicketInput) => string; onView: (id: string) => void; seedAssetId?: string }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [problem, setProblem] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assetId, setAssetId] = useState("none");
  const [location, setLocation] = useState("Bangkok HQ");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setStep(seedAssetId ? 3 : 1); setCategory(seedAssetId ? "Computer / Notebook" : ""); setProblem(seedAssetId ? "Other" : ""); setTitle(seedAssetId ? `Problem with ${assets.find(asset => asset.id === seedAssetId)?.name ?? seedAssetId}` : ""); setDescription(""); setAssetId(seedAssetId ?? "none"); setLocation(assets.find(asset => asset.id === seedAssetId)?.location ?? "Bangkok HQ"); setAttachments([]); setCreatedId(""); setError(""); } }, [open, seedAssetId]);
  const addFiles = (files: FileList | null) => { if (!files) return; const valid = Array.from(files).filter(file => file.type.startsWith("image/") || file.type === "application/pdf"); if (valid.length !== files.length) setError("Only images and PDF files are supported."); else setError(""); setAttachments(current => [...new Set([...current, ...valid.map(file => file.name)])]); };
  const drop = (event: DragEvent<HTMLButtonElement>) => { event.preventDefault(); addFiles(event.dataTransfer.files); };
  const review = () => { if (!title.trim() || !description.trim()) { setError("Enter a title and description to continue."); return; } setError(""); setStep(4); };
  const submit = () => { if (!title.trim() || !description.trim()) { setError("Enter a title and description to submit."); setStep(3); return; } const id = onSubmit({ category, problem, title: title.trim(), description: description.trim(), assetId, location, attachments }); setCreatedId(id); setStep(5); };
  const close = () => onClose();
  return <Dialog open={open} onOpenChange={value => { if (!value) close(); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{step === 5 ? "Ticket Created" : "Create a Ticket"}</DialogTitle><DialogDescription>{step === 5 ? "Your request has been added to the prototype ticket list." : `Step ${step} of 4 · Tell us what you need help with.`}</DialogDescription></DialogHeader>
    {step < 5 && <div className="grid grid-cols-4 gap-2" aria-label={`Step ${step} of 4`}>{[1, 2, 3, 4].map(number => <span key={number} className={`h-1.5 rounded-full ${number <= step ? "bg-primary" : "bg-muted"}`} />)}</div>}
    {step === 1 && <div><h3 className="mb-4 text-lg font-semibold">What can we help you with?</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{categories.map(([Icon, label]) => <button key={label} onClick={() => { setCategory(label); setStep(2); }} className="rounded-xl border p-4 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"><Icon className="mb-3 size-5 text-primary" /><span className="text-sm font-medium">{label}</span></button>)}</div></div>}
    {step === 2 && <div><h3 className="mb-4 text-lg font-semibold">What seems to be the problem?</h3><div className="space-y-2">{(problems[category] ?? problems.Other).map(value => <button key={value} onClick={() => { setProblem(value); setTitle(value === "Other" ? "" : value); setStep(3); }} className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:border-primary hover:bg-accent"><span>{value}</span><ChevronRight className="size-4" /></button>)}</div></div>}
    {step === 3 && <div className="space-y-4"><div><label htmlFor="new-ticket-title" className="mb-1.5 block text-sm font-medium">Title <span className="text-red-600">*</span></label><Input id="new-ticket-title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Brief summary of the issue" /></div><div><label htmlFor="new-ticket-description" className="mb-1.5 block text-sm font-medium">Description <span className="text-red-600">*</span></label><Textarea id="new-ticket-description" value={description} onChange={event => setDescription(event.target.value)} className="min-h-28" placeholder="What happened? What did you expect?" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-medium">Related Asset</label><Select value={assetId} onValueChange={setAssetId}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No related asset</SelectItem>{assets.map(asset => <SelectItem key={asset.id} value={asset.id}>{asset.id} · {asset.name}</SelectItem>)}</SelectContent></Select></div><div><label className="mb-1.5 block text-sm font-medium">Location</label><Select value={location} onValueChange={setLocation}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["Bangkok HQ", "Chiang Mai Office", "Remote", "Service Center"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div></div><input ref={fileRef} type="file" accept="image/*,.pdf,application/pdf" multiple className="sr-only" onChange={event => addFiles(event.target.files)} /><button type="button" onClick={() => fileRef.current?.click()} onDragOver={event => event.preventDefault()} onDrop={drop} className="grid w-full place-items-center rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground hover:bg-muted/50"><Upload className="mb-2 size-5" />Drop images or PDFs here, or click to choose</button>{attachments.length > 0 && <div className="flex flex-wrap gap-2">{attachments.map(name => <span key={name} className="flex items-center gap-2 rounded-lg border px-2 py-1 text-xs"><Paperclip className="size-3" />{name}<button aria-label={`Remove ${name}`} onClick={() => setAttachments(current => current.filter(item => item !== name))}>×</button></span>)}</div>}</div>}
    {step === 4 && <div><h3 className="mb-4 text-lg font-semibold">Review your request</h3><dl className="divide-y rounded-xl border">{[["Category", category], ["Problem", problem], ["Asset", assetId === "none" ? "None" : `${assetId} · ${assets.find(asset => asset.id === assetId)?.name ?? ""}`], ["Location", location], ["Title", title], ["Description", description], ["Attachments", attachments.length ? attachments.join(", ") : "None"]].map(([key, value]) => <div key={key} className="grid gap-1 p-3 sm:grid-cols-[120px_1fr]"><dt className="text-sm text-muted-foreground">{key}</dt><dd className="break-words text-sm font-medium">{value}</dd></div>)}</dl></div>}
    {step === 5 && <div className="py-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" /></span><p className="mt-5 text-sm text-muted-foreground">Ticket number</p><p className="mt-1 font-mono text-2xl font-semibold">{createdId}</p><p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">The new ticket is visible in the ticket list for this session.</p></div>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    <DialogFooter>{step > 1 && step < 5 && <Button variant="outline" onClick={() => { setError(""); setStep(step - 1); }}>Back</Button>}{step === 3 && <Button onClick={review}>Review<ChevronRight className="size-4" /></Button>}{step === 4 && <Button onClick={submit}>Submit Ticket</Button>}{step === 5 && <><Button variant="outline" onClick={close}>Done</Button><Button onClick={() => { close(); onView(createdId); }}>View Ticket</Button></>}</DialogFooter>
  </DialogContent></Dialog>;
}
