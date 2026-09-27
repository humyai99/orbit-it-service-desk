"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Laptop, Plus, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import type { Asset, Ticket } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, MetricStrip, PageHeader, Panel, ToneBadge } from "@/features/portal/shared";
import { TicketRows } from "@/features/tickets/components";

const pageSize = 5;

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="min-w-32"><SelectValue placeholder={label} /></SelectTrigger><SelectContent><SelectItem value="all">All {label}</SelectItem>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}

export function AssetsPage({ assets, onOpen }: { assets: Asset[]; onOpen: (asset: Asset) => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");
  const [warranty, setWarranty] = useState("all");
  const [sort, setSort] = useState("tag");
  const [page, setPage] = useState(1);
  const reset = () => { setQuery(""); setType("all"); setStatus("all"); setDepartment("all"); setLocation("all"); setWarranty("all"); setSort("tag"); setPage(1); };
  const setFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const filtered = useMemo(() => assets.filter(asset => {
    const q = query.trim().toLocaleLowerCase();
    if (q && ![asset.id, asset.name, asset.serial, asset.user, asset.hostname].join(" ").toLocaleLowerCase().includes(q)) return false;
    if (type !== "all" && asset.type !== type) return false;
    if (status !== "all" && asset.status !== status) return false;
    if (department !== "all" && asset.department !== department) return false;
    if (location !== "all" && asset.location !== location) return false;
    const days = parseInt(asset.warranty, 10);
    if (warranty === "expiring" && (Number.isNaN(days) || days > 365)) return false;
    if (warranty === "expired" && asset.warranty !== "Expired") return false;
    return true;
  }).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "repairs" ? b.repairs - a.repairs : a.id.localeCompare(b.id)), [assets, query, type, status, department, location, warranty, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <>
    <PageHeader title="Assets" description="Lifecycle, assignment, repair, and warranty visibility." actions={<Button onClick={() => toast.info("Asset creation is planned for the next phase") }><Plus className="size-4" />Add Asset</Button>} />
    <MetricStrip items={[["Total Assets", "1,248", "Across 4 locations"], ["In Use", "984", "78.8% utilization"], ["In Stock", "176", "Ready to assign"], ["Repair", "23", "5 frequent repairs"]]} />
    <div className="my-5 flex flex-wrap gap-2"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search assets" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} className="pl-9" placeholder="Asset tag, serial, user, hostname…" /></div><FilterSelect label="Type" value={type} options={[...new Set(assets.map(asset => asset.type))].sort()} onChange={setFilter(setType)} /><FilterSelect label="Status" value={status} options={[...new Set(assets.map(asset => asset.status))].sort()} onChange={setFilter(setStatus)} /><FilterSelect label="Department" value={department} options={[...new Set(assets.map(asset => asset.department))].sort()} onChange={setFilter(setDepartment)} /><FilterSelect label="Location" value={location} options={[...new Set(assets.map(asset => asset.location))].sort()} onChange={setFilter(setLocation)} /><FilterSelect label="Warranty" value={warranty} options={["expiring", "expired"]} onChange={setFilter(setWarranty)} /></div>
    <Panel title={`${filtered.length} Assets`} action={<div className="flex items-center gap-2"><Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button><Select value={sort} onValueChange={setFilter(setSort)}><SelectTrigger aria-label="Sort assets"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tag">Asset tag</SelectItem><SelectItem value="name">Name A–Z</SelectItem><SelectItem value="repairs">Most repairs</SelectItem></SelectContent></Select></div>}>
      {filtered.length ? <><div className="divide-y md:hidden">{visible.map(asset => <button key={asset.id} onClick={() => onOpen(asset)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50"><div className="grid size-9 place-items-center rounded-lg bg-muted"><Laptop className="size-4" /></div><div className="min-w-0 flex-1"><p className="font-medium">{asset.name}</p><p className="font-mono text-xs text-muted-foreground">{asset.id} · {asset.user}</p></div><ToneBadge value={asset.status} /></button>)}</div><div className="hidden overflow-x-auto md:block"><Table className="min-w-[800px]"><TableHeader className="bg-muted/60"><TableRow>{["Asset", "Type", "Assigned User", "Department", "Location", "Status", "Warranty"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(asset => <TableRow key={asset.id} onClick={() => onOpen(asset)} tabIndex={0} onKeyDown={event => { if (event.key === "Enter") onOpen(asset); }} className="cursor-pointer hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"><TableCell><p className="font-medium">{asset.name}</p><p className="font-mono text-xs text-muted-foreground">{asset.id}</p></TableCell><TableCell>{asset.type}</TableCell><TableCell>{asset.user}</TableCell><TableCell>{asset.department}</TableCell><TableCell>{asset.location}</TableCell><TableCell><ToneBadge value={asset.status} /></TableCell><TableCell>{asset.warranty}</TableCell></TableRow>)}</TableBody></Table></div></> : <EmptyState title="No assets match your filters" description="Try changing your search or filter selection." onClear={reset} />}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground"><span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="size-4" />Previous</Button><span>{currentPage} / {pageCount}</span><Button size="sm" variant="outline" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight className="size-4" /></Button></div></div>
    </Panel>
  </>;
}

export function AssetDetail({ asset, tickets, onBack, onReport, onTicket }: { asset: Asset; tickets: Ticket[]; onBack: () => void; onReport: (id: string) => void; onTicket: (ticket: Ticket) => void }) {
  const related = tickets.filter(ticket => ticket.asset === asset.id);
  return <>
    <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to assets</button>
    <PageHeader eyebrow={asset.id} title={asset.name} description={`${asset.type} · ${asset.hostname}`} actions={<><ToneBadge value={asset.status} /><Button variant="outline" onClick={() => toast.info("Asset editing is planned for the next phase")}>Edit</Button><Button onClick={() => onReport(asset.id)}><Wrench className="size-4" />Report Problem</Button></>} />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="min-w-0"><div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">{[["Assigned To", asset.user], ["Department", asset.department], ["Location", asset.location], ["Serial Number", asset.serial], ["Hostname", asset.hostname], ["Warranty", asset.warranty]].map(([key, value]) => <div key={key} className="bg-card p-5"><p className="text-xs text-muted-foreground">{key}</p><p className="mt-1 font-medium">{value}</p></div>)}</div><Tabs defaultValue="overview" className="mt-6"><TabsList className="flex h-auto flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="tickets">Tickets ({related.length})</TabsTrigger><TabsTrigger value="repair">Repair History</TabsTrigger><TabsTrigger value="assignment">Assignment History</TabsTrigger></TabsList><TabsContent value="overview"><Panel title="Specification" className="mt-4"><div className="grid gap-px bg-border sm:grid-cols-2">{[["CPU", "Intel Core Ultra 7"], ["RAM", "32 GB"], ["Storage", "1 TB NVMe"], ["OS", "Windows 11 Pro"]].map(([key, value]) => <div key={key} className="bg-card p-4"><p className="text-xs text-muted-foreground">{key}</p><p className="mt-1 font-medium">{value}</p></div>)}</div></Panel></TabsContent><TabsContent value="tickets"><Panel title="Related Tickets" className="mt-4">{related.length ? <TicketRows rows={related} onOpen={onTicket} /> : <EmptyState title="No related tickets" description="Tickets linked to this asset will appear here." />}</Panel></TabsContent><TabsContent value="repair"><Panel title="Repair History" description={`${asset.repairs} repair records`} className="mt-4"><div className="divide-y">{["SSD health check and OS recovery", "Battery replacement", "Keyboard replacement", "Cooling fan service"].slice(0, asset.repairs).map((label, index) => <div key={label} className="p-4"><p className="font-medium">{label}</p><p className="text-xs text-muted-foreground">Service Center · {index + 2} months ago</p></div>)}{asset.repairs === 0 && <EmptyState title="No repairs recorded" description="This asset has no repair history in the sample data." />}</div></Panel></TabsContent><TabsContent value="assignment"><Panel title="Assignment History" className="mt-4"><div className="space-y-4 p-5 text-sm"><p>Purchased and received by IT</p><p>Assigned to {asset.user}</p><p>Transferred to {asset.department}</p></div></Panel></TabsContent></Tabs></div><Panel title="Asset Health"><div className="grid grid-cols-2 gap-px bg-border">{[["Repair Count", String(asset.repairs)], ["Tickets", String(related.length)], ["Downtime", "12 hours"], ["Repair Cost", asset.cost]].map(([label, value]) => <div key={label} className="bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>{asset.repairs >= 3 && <div className="m-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"><AlertTriangle className="mr-2 inline size-4" />Frequent Repair · Consider replacement.</div>}</Panel></div>
  </>;
}
