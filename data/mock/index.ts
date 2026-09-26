import type { Asset, Person, Ticket } from "@/types";

export const tickets: Ticket[] = [
 {id:"INC-2026-00128",title:"Notebook cannot boot after Windows update",requester:"Somchai Jaidee",department:"Accounting",category:"Hardware",priority:"P2 High",status:"In Progress",assignee:"Nattapon Wongchai",sla:"01:24",created:"Today 09:42",updated:"5 min ago",description:"The notebook restarted after the latest Windows update and now stops at a black screen before sign-in.",asset:"AST-NB-0042",location:"Bangkok HQ"},
 {id:"INC-2026-00127",title:"Wi-Fi disconnects in Meeting Room B",requester:"พิมพ์ชนก ศรีสุข",department:"Sales",category:"Network",priority:"P1 Critical",status:"Assigned",assignee:"Krit Sutham",sla:"00:18",created:"Today 09:31",updated:"8 min ago",description:"Video calls disconnect every few minutes in Meeting Room B on floor 8.",location:"Bangkok HQ"},
 {id:"INC-2026-00126",title:"Adobe license activation failed",requester:"Kanda Lim",department:"Marketing",category:"Software",priority:"P3 Medium",status:"Waiting",assignee:"Nattapon Wongchai",sla:"05:42",created:"Today 08:56",updated:"18 min ago",description:"Creative Cloud asks for a license after sign-in. Screenshot attached.",asset:"AST-NB-0188",location:"Chiang Mai Office"},
 {id:"INC-2026-00125",title:"Printer queue stuck on Finance floor",requester:"Thanawat Boonmee",department:"Finance",category:"Printer",priority:"P2 High",status:"New",assignee:"Unassigned",sla:"02:08",created:"Yesterday 16:20",updated:"24 min ago",description:"Print jobs stay queued on the shared Epson printer.",location:"Bangkok HQ"},
 {id:"INC-2026-00124",title:"VPN access needed for new analyst",requester:"Elena Rossi",department:"Strategy",category:"Account / Access",priority:"P3 Medium",status:"Resolved",assignee:"Krit Sutham",sla:"Completed",created:"Yesterday 14:04",updated:"1 hr ago",description:"Please provision standard VPN access for the new analyst.",location:"Remote"},
 {id:"INC-2026-00123",title:"Battery drains within one hour",requester:"นลิน วัฒนะ",department:"Legal",category:"Hardware",priority:"P4 Low",status:"Waiting",assignee:"Mali Charoen",sla:"18:20",created:"Yesterday 11:16",updated:"2 hrs ago",description:"Battery capacity dropped suddenly after two years of use.",asset:"AST-NB-0079",location:"Bangkok HQ"},
];

export const assets: Asset[] = [
 {id:"AST-NB-0042",name:"Dell Latitude 5450",type:"Notebook",model:"Latitude 5450",user:"Somchai Jaidee",department:"Accounting",location:"Bangkok HQ",status:"In Use",warranty:"243 days",serial:"DL5450-AC42",hostname:"ACC-NB-042",repairs:3,tickets:5,cost:"฿4,500"},
 {id:"AST-NB-0188",name:"MacBook Pro 14",type:"Notebook",model:"M3 Pro",user:"Kanda Lim",department:"Marketing",location:"Chiang Mai Office",status:"In Use",warranty:"498 days",serial:"C02X91MKT",hostname:"MKT-MBP-0188",repairs:0,tickets:1,cost:"฿0"},
 {id:"AST-PC-0116",name:"HP EliteDesk 800 G9",type:"Desktop",model:"EliteDesk 800 G9",user:"Thanawat Boonmee",department:"Finance",location:"Bangkok HQ",status:"In Use",warranty:"91 days",serial:"HP8G9-FN116",hostname:"FIN-PC-116",repairs:1,tickets:2,cost:"฿1,200"},
 {id:"AST-MN-0204",name:"Dell UltraSharp U2723QE",type:"Monitor",model:"U2723QE",user:"Unassigned",department:"IT",location:"Bangkok Store",status:"In Stock",warranty:"621 days",serial:"DLU27-ST204",hostname:"—",repairs:0,tickets:0,cost:"฿0"},
 {id:"AST-NB-0079",name:"Lenovo ThinkPad T14",type:"Notebook",model:"T14 Gen 3",user:"นลิน วัฒนะ",department:"Legal",location:"Service Center",status:"Repair",warranty:"Expired",serial:"LNV-T14-079",hostname:"LEG-NB-079",repairs:4,tickets:7,cost:"฿8,900"},
];

export const people: Person[] = [
 {id:"USR-0042",name:"Somchai Jaidee",nameTh:"สมชาย ใจดี",department:"Accounting",role:"Senior Accountant",email:"somchai.j@orbit.co.th",assets:2,tickets:1,status:"Active"},
 {id:"USR-0088",name:"Kanda Lim",department:"Marketing",role:"Creative Lead",email:"kanda.l@orbit.co.th",assets:3,tickets:1,status:"Active"},
 {id:"USR-0116",name:"Thanawat Boonmee",nameTh:"ธนวัฒน์ บุญมี",department:"Finance",role:"Finance Analyst",email:"thanawat.b@orbit.co.th",assets:2,tickets:2,status:"Active"},
 {id:"USR-0203",name:"Elena Rossi",department:"Strategy",role:"Business Analyst",email:"elena.r@orbit.co.th",assets:1,tickets:0,status:"Active"},
];

export const knowledge = [
 {title:"Connect to Orbit VPN on Windows 11",category:"VPN",description:"Set up secure remote access and resolve common connection errors.",views:"1.2k",updated:"2 days ago"},
 {title:"Fix a printer that shows Offline",category:"Printer",description:"Quick checks for shared printers and stuck print queues.",views:"864",updated:"1 week ago"},
 {title:"Reset your Microsoft 365 password",category:"Microsoft 365",description:"Recover access and update credentials on every device.",views:"2.4k",updated:"3 days ago"},
 {title:"Request software or a new license",category:"Software",description:"What information IT needs to approve and install software.",views:"579",updated:"2 weeks ago"},
];
