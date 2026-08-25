# For You — Anniversary Interactive Website

เว็บไซต์ของขวัญดิจิทัลสำหรับวันครบรอบ สร้างด้วย Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion

โทน **Dark Romantic / Dreamy / Cinematic** — พื้นหลังไล่สีดำ-ม่วง-ชมพูเข้ม, Glow นุ่มๆ, ตัวอักษร Cormorant Garamond (หัวข้อ) + Inter (เนื้อหา), เส้น "heartbeat" บางๆ ด้านบนสุดของจอไล่ตามความคืบหน้าของการเลื่อนหน้าเว็บ แทนความรู้สึกว่าเรื่องราวกำลังเดินไปเรื่อยๆ

---

## 1. โครงสร้างโปรเจกต์

```text
anniversary-site/
├── src/
│   ├── app/
│   │   ├── page.tsx          # ประกอบทุก Section เข้าด้วยกัน
│   │   ├── layout.tsx        # Font + Metadata
│   │   └── globals.css       # Base styles, reduced-motion, focus states
│   │
│   ├── components/
│   │   ├── Hero.tsx              # หน้าแรก / Opening Scene
│   │   ├── ParticleBackground.tsx# Canvas particle system (perf-friendly)
│   │   ├── FloatingHearts.tsx    # หัวใจลอย (จำนวนน้อย ควบคุมได้)
│   │   ├── StorySection.tsx      # ข้อความเปิดเรื่อง (Blur → Sharp)
│   │   ├── PhotoSection.tsx      # แกลเลอรีรูปภาพ
│   │   ├── GalaxyGallery.tsx     # ★ กาแลคซี่อนุภาคหมุนได้ + รูปโคจร ซูมได้ ★
│   │   ├── Counter.tsx           # นับวัน-ชม.-นาที-วิ real-time
│   │   ├── Timeline.tsx          # Timeline ความทรงจำ พร้อมเส้น scroll-linked
│   │   ├── MemoryCard.tsx        # การ์ดความทรงจำ กดเปิด Modal ได้
│   │   ├── SecretMessage.tsx     # ข้อความลับ กดเปิดทีละบรรทัด
│   │   ├── FinalSection.tsx      # ฉากปิดท้าย
│   │   ├── MusicPlayer.tsx       # ปุ่มเพลงมุมขวาบน
│   │   └── Navigation.tsx        # เส้น progress + dot nav (desktop)
│   │
│   ├── data/
│   │   └── memories.ts       # ★ ข้อมูลทั้งหมดที่แก้ไขได้ ★
│   │
│   └── lib/
│       └── animations.ts     # Framer Motion variants ที่ใช้ร่วมกัน
│
├── public/
│   ├── images/                # รูปคู่รัก (photo1–4.jpg เป็นภาพตัวอย่าง)
│   └── music/song.mp3         # เพลงพื้นหลัง (ไฟล์ตัวอย่างเป็นเสียงเงียบ)
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

> หมายเหตุ: ดูวิดีโอตัวอย่างที่แนบมาแล้ว และเพิ่ม Section ใหม่คือ **"กาแลคซี่" (`#galaxy`)** ที่จำลองลูกเล่นจากคลิป — วงโคจรอนุภาคหมุนเป็นสไปรัล พร้อมหัวใจที่เกิดจากอนุภาคลอยอยู่ด้านบน และรูปภาพที่โคจรรอบๆ สามารถ **Scroll/หมุนนิ้ว (Pinch) เพื่อซูม** เข้า-ออกได้ทั้งเดสก์ท็อปและมือถือ (มีปุ่ม + / − สำรองไว้ด้วย) กดที่รูปดวงใดก็ได้เพื่อ "ซูมเข้า" ไปดูรูปเต็มพร้อมวันที่และคำบรรยาย ไม่ได้ก็อปปี้ Asset หรือโลโก้ TikTok จากคลิปมาโดยตรง แต่ตีความ Mood/ลูกเล่นใหม่ด้วยโค้ดของเราเอง

### จุดที่ตั้งใจดึงมาจากคลิป
- กาแลคซี่อนุภาคหมุนเป็นสไปรัล (Canvas, ไม่ใช้ DOM element จำนวนมาก เพื่อ Performance)
- หัวใจที่เกิดจากอนุภาคลอยเบาๆ เหนือกาแลคซี่
- เอฟเฟกต์ "วาร์ปเข้า" ตอนอนุภาคก่อตัวครั้งแรกเมื่อเลื่อนมาถึง Section นี้
- รูปภาพลอยโคจรรอบกาแลคซี่ กดแล้ว "ซูม" เข้าไปดูแบบเต็มจอ (ใช้ Framer Motion shared-element transition)
- รองรับ `prefers-reduced-motion` เหมือนเดิม — จะลดการหมุน/วาร์ปลงอัตโนมัติ

---

## 2. วิธี Run โปรเจกต์

```bash
npm install
npm run dev
```

เปิดที่ [http://localhost:3000](http://localhost:3000)

## 3. วิธี Build Production

```bash
npm run build
npm run start
```

Build ผ่านแล้วโดยไม่มี TypeScript error หรือ ESLint error (ทดสอบแล้วในสภาพแวดล้อมนี้ — ฟอนต์ Google Fonts จะถูกดึงตอน build ด้วย `next/font/google` ซึ่งต้องมีอินเทอร์เน็ตตอน build).

---

## 4a. วิธีแก้รูป/ข้อความในกาแลคซี่

แก้ได้ที่ `src/data/memories.ts` ตัวแปร `galaxyPhotos` — แต่ละดวงมี:

```ts
{
  id: "g1",
  image: "/images/photo1.jpg",
  date: "14/02/2024",
  caption: "The day our story began.",
  radius: 0.92, // ระยะจากศูนย์กลาง (0–1)
  angle: 20,    // มุมเริ่มต้น (องศา)
  size: 76,     // ขนาดรูป (px)
}
```

เพิ่ม/ลบรายการในลิสต์นี้ได้ตามต้องการ (แนะนำ 4–8 ดวงเพื่อไม่ให้แน่นเกินไป)

## 4. วิธีเพิ่ม/เปลี่ยนรูปภาพ

1. นำรูปของคุณไปวางที่ `public/images/` เช่น `photo1.jpg`, `photo2.jpg`, ...
2. แก้ path ในไฟล์ `src/data/memories.ts` ที่ตัวแปร `photos` และ `memories` และ `memoryCards`

```ts
export const photos = {
  main: "/images/photo1.jpg",
  secondary: ["/images/photo2.jpg", "/images/photo3.jpg", "/images/photo4.jpg"],
  caption: "ข้อความใต้รูป",
};
```

รูปตัวอย่างที่ให้มาตอนนี้เป็น Gradient แบบ Placeholder เท่านั้น — แนะนำให้เปลี่ยนเป็นรูปจริงก่อนใช้งานจริง

## 5. วิธีเปลี่ยนชื่อ

แก้ในไฟล์ `src/data/memories.ts`:

```ts
export const couple = {
  name: "Your Name",       // ชื่อผู้ส่ง (จะโชว์ในฉากสุดท้าย "Always, ชื่อคุณ")
  partner: "Partner Name", // ชื่อคนรัก (ใช้อ้างอิงในอนาคตได้)
  anniversaryDate: "2024-02-14T00:00:00",
};
```

## 6. วิธีเปลี่ยนวันที่ Anniversary

แก้ค่า `anniversaryDate` ในไฟล์เดียวกัน รูปแบบ `"YYYY-MM-DDTHH:mm:ss"`:

```ts
anniversaryDate: "2024-02-14T00:00:00",
```

ตัวนับ (`Counter.tsx`) จะคำนวณและอัปเดตวินาทีต่อวินาทีให้อัตโนมัติ

## 7. วิธีเปลี่ยนข้อความ

ข้อความทุกจุดของเว็บไซต์แก้ได้จากไฟล์เดียวคือ `src/data/memories.ts`:

- `openingText` — ข้อความหน้าแรก
- `introText` — ข้อความ Section เปิดเรื่อง
- `memories` — รายการ Timeline (วันที่ / ปี / หัวข้อ / คำอธิบาย / รูป)
- `memoryCards` — การ์ดความทรงจำ 3 ใบ
- `secretMessage` — ข้อความลับที่กดเปิด
- `finalScene` — ข้อความฉากปิดท้าย

## 8. วิธีเปลี่ยนเพลง

1. นำไฟล์เพลงไปวางที่ `public/music/song.mp3` (ทับไฟล์เดิม)
2. ไม่ต้องแก้โค้ดใดๆ เพิ่มเติม — `page.tsx` อ้างอิง path นี้อยู่แล้ว
3. เพลงจะไม่เล่นอัตโนมัติตอนเปิดเว็บ (ป้องกัน Browser Block Autoplay) แต่จะเริ่มเล่นทันทีที่ผู้ใช้กดปุ่ม "Start Our Story" และกดปิด/เปิดได้จากปุ่มมุมขวาบนตลอดเวลา

---

## 9. Accessibility & Performance ที่ทำไว้แล้ว

- รองรับ `prefers-reduced-motion`: ลด/ปิด Animation ให้อัตโนมัติ
- ทุกปุ่มมี Focus State ที่มองเห็นได้ชัดเมื่อกด Tab
- รูปภาพใช้ `next/image` พร้อม `sizes` ที่เหมาะสมสำหรับ Lazy Load
- Particle Background วาดด้วย Canvas (ไม่ใช่ DOM element จำนวนมาก) และหยุดวาดเมื่อสลับแท็บ เพื่อประหยัดพลังงานบนมือถือ
- จำนวน Floating Hearts ถูกจำกัดไว้ที่ 7 ดวงเพื่อไม่ให้หน้าจอรก
