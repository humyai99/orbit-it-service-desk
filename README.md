# Orbit IT Service Desk

ต้นแบบ Frontend สำหรับระบบ IT Service Desk และ Asset Management ภายในองค์กร มี Dashboard, Tickets, Assets, Inventory, Software, Users, Knowledge Base และ Reports

> **สถานะโครงการ: Frontend Prototype เท่านั้น** — ยังไม่ได้เชื่อม Database, API, Authentication Backend หรือ Backend Service ใด ๆ ข้อมูลทั้งหมดเป็น Mock Data ในโปรเจกต์ การเปลี่ยนสถานะ Ticket, การตอบกลับ และการสร้าง Ticket เป็นเพียงการจำลองบนหน้าจอ ไม่มีการบันทึกถาวร เมื่อรีโหลดหน้า ข้อมูลจะกลับเป็นชุดตัวอย่างเดิม จึงไม่ควรใช้รับคำขอหรือเก็บข้อมูลจริงขององค์กร

## เปิดเว็บที่เผยแพร่แล้ว

เปิด [Orbit IT Service Desk](https://orbit-it-service-desk.petchtaeza2006.chatgpt.site) เว็บไซต์ตั้งค่าเป็นแบบ Private ผู้เปิดต้องมีสิทธิ์เข้าถึง Site นี้

## เปิดบนเครื่องตัวเอง

เตรียม Git และ Node.js **22.13.0 ขึ้นไป** Repository บน GitHub เป็นแบบ Private จึงต้องใช้บัญชีที่มีสิทธิ์เข้าถึง

```bash
git clone https://github.com/humyai99/orbit-it-service-desk.git
cd orbit-it-service-desk
npm ci
npm run dev
```

จากนั้นเปิด URL ที่แสดงใน Terminal โดยปกติคือ [http://localhost:5173](http://localhost:5173) หากต้องการหยุดเซิร์ฟเวอร์ กด `Ctrl+C` ใน Terminal

บน Windows เครื่องที่ใช้สร้างโปรเจกต์นี้ ตัวเรียก `npm` ใน PowerShell อาจแจ้งว่าไม่พบ `node_modules/npm/bin/npm-cli.js` หากพบปัญหานี้ ให้เรียก npm โดยตรง:

```powershell
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' ci --ignore-scripts
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

## ทดลองใช้อะไรได้บ้าง

- ไปยังหน้าต่าง ๆ และดูข้อมูล Ticket, Asset และ User ตัวอย่าง
- ค้นหาข้อมูลตัวอย่างผ่าน Global Search (`Ctrl+K` หรือ `Cmd+K`)
- กรอง เรียงลำดับ และแบ่งหน้ารายการ Ticket/Asset; เปิด URL รายละเอียด Ticket/Asset โดยตรงได้
- สร้าง Ticket ผ่านแบบฟอร์ม 4 ขั้นตอน เลือก Asset/Location ตรวจทานข้อมูล แล้วเปิด Ticket ที่สร้างใหม่
- เปลี่ยนสถานะ/ผู้รับผิดชอบ และเพิ่มข้อความตอบกลับหรือบันทึกภายใน โดยรายการและหน้ารายละเอียดจะแสดงข้อมูลตรงกันระหว่างเซสชัน
- ทดลอง Workflow: เปลี่ยน Priority, มอบหมายงาน, Escalate เป็น P1, พัก SLA เมื่อ Waiting และบันทึกการเปลี่ยนแปลงใน Timeline
- ดู SLA ตามเป้าหมาย Priority และแจ้งเตือน Ticket ใกล้เกินกำหนดแบบจำลอง (ไม่ใช่ตัวจับเวลาจริง และไม่มีการส่ง Email/Push)
- ค้นหาและเปิดคู่มือใน Knowledge Base; ระหว่างสร้าง Ticket ระบบจะแนะนำคู่มือที่เกี่ยวข้องเพื่อทดลองแก้ปัญหาก่อนส่งคำขอ
- สลับ Light/Dark Mode และทดลองหน้าจอขนาดมือถือ

Mock Data อยู่ที่ [`data/mock/index.ts`](data/mock/index.ts), Type อยู่ที่ [`types/index.ts`](types/index.ts) และหน้าจอหลักอยู่ที่ [`features/portal/app.tsx`](features/portal/app.tsx) บางปุ่มเป็น UI Placeholder สำหรับ Phase ถัดไปและยังไม่บันทึกข้อมูล ไฟล์แนบในขั้นตอนสร้าง Ticket แสดงเพียงชื่อไฟล์ ไม่มีการอัปโหลดหรือเก็บไฟล์จริง

## ตรวจสอบ Build

```bash
npm run build
```

คำสั่งนี้ตรวจว่า Frontend คอมไพล์ได้ ไม่ได้สร้างหรือเชื่อม Database/Backend
