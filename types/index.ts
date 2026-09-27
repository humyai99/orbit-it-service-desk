export type Priority = "P1 Critical" | "P2 High" | "P3 Medium" | "P4 Low";
export type TicketStatus = "New" | "Assigned" | "In Progress" | "Waiting" | "Resolved" | "Closed";
export type Ticket = { id:string; title:string; requester:string; department:string; category:string; priority:Priority; status:TicketStatus; assignee:string; sla:string; created:string; updated:string; description:string; asset?:string; location:string; attachments?:string[] };
export type Asset = { id:string; name:string; type:string; model:string; user:string; department:string; location:string; status:"In Use"|"In Stock"|"Repair"|"Retired"; warranty:string; serial:string; hostname:string; repairs:number; tickets:number; cost:string };
export type Person = { id:string; name:string; nameTh?:string; department:string; role:string; email:string; assets:number; tickets:number; status:"Active"|"Inactive" };

export type TicketMessage = {
  id: string;
  author: string;
  role: "Requester" | "IT Support";
  body: string;
  time: string;
  visibility: "public" | "internal";
};

export type TicketEvent = { id: string; time: string; label: string };

export type NewTicketInput = {
  category: string;
  problem: string;
  title: string;
  description: string;
  assetId: string;
  location: string;
  attachments: string[];
};
