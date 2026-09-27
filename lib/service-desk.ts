import type { Priority, Ticket, TicketStatus } from "@/types";

export const slaHours: Record<Priority, number> = {
  "P1 Critical": 1,
  "P2 High": 4,
  "P3 Medium": 8,
  "P4 Low": 24,
};

export function slaMinutes(value: string) {
  const match = value.match(/^(\d+):(\d+)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : Infinity;
}

export function formatSla(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function slaState(ticket: Ticket) {
  const complete = ticket.status === "Resolved" || ticket.status === "Closed";
  const paused = ticket.status === "Waiting";
  const remaining = slaMinutes(ticket.sla);
  const risk = !complete && !paused && remaining <= 120;
  const target = slaHours[ticket.priority] * 60;
  const progress = complete ? 100 : Math.max(0, Math.min(100, Math.round((1 - remaining / target) * 100)));
  return { complete, paused, risk, remaining, target, progress, label: complete ? "Completed" : paused ? "Paused · waiting for requester" : risk ? "At risk · under 2 hours left" : "On track" };
}

export function transitionSla(ticket: Ticket, status: TicketStatus, priority = ticket.priority): string {
  if (status === "Resolved" || status === "Closed") return "Completed";
  if (ticket.sla === "Completed") return formatSla(slaHours[priority] * 60);
  if (priority !== ticket.priority) {
    const elapsed = Math.max(0, slaHours[ticket.priority] * 60 - slaMinutes(ticket.sla));
    return formatSla(Math.max(0, slaHours[priority] * 60 - elapsed));
  }
  return ticket.sla;
}
