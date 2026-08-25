"use client";

import { useState } from "react";
import { Pencil, RotateCcw, Save, Trash2, Upload, X } from "lucide-react";
import { useAnniversaryContent, type AnniversaryContent } from "@/lib/content";

export default function ContentEditor({ onSave, autoOpen = false }: { onSave?: (content: AnniversaryContent, password: string) => Promise<void> | void; autoOpen?: boolean } = {}) {
  const { content, updateContent, resetContent } = useAnniversaryContent();
  const [open, setOpen] = useState(autoOpen);
  const [draft, setDraft] = useState(content);
  const [passwordEnabled, setPasswordEnabled] = useState(true);
  const [password, setPassword] = useState("");

  const startEditing = () => { setDraft(content); setOpen(true); };
  const set = (path: string, value: string) => {
    setDraft((current) => {
      const keys = path.split(".");
      const next = { ...current } as AnniversaryContent;
      const updateNested = (node: any, remaining: string[]): any => {
        if (remaining.length === 1) {
          node[remaining[0]] = value;
          return node;
        }

        const [head, ...rest] = remaining;
        const child = node[head];
        node[head] = Array.isArray(child) ? [...child] : { ...(child ?? {}) };
        return updateNested(node[head], rest);
      };

      updateNested(next, keys);
      return next;
    });
  };
  const image = (path: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => set(path, String(reader.result));
    reader.readAsDataURL(file);
  };
  const audio = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => set("musicUrl", String(reader.result));
    reader.readAsDataURL(file);
  };
  const save = async () => {
    if (onSave && passwordEnabled && !/^\d{8}$/.test(password)) return;
    updateContent(draft);
    await onSave?.(draft, passwordEnabled ? password : "");
    setOpen(false);
  };
  const reset = () => { resetContent(); setDraft(content); };

  if (!open) return <button onClick={startEditing} aria-label="Edit page" className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-bloom-rose/40 bg-void-950/90 px-4 py-3 text-xs uppercase tracking-[0.16em] text-bloom-white shadow-glow-sm backdrop-blur"><Pencil className="h-4 w-4" /> Edit page</button>;

  const Field = ({ label, path, area = false }: { label: string; path: string; area?: boolean }) => {
    const keys = path.split(".");
    let value: unknown = draft;
    keys.forEach((key) => { value = (value as Record<string, unknown>)[key]; });
    return <label className="block text-xs text-bloom-white/60"><span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-bloom-white/70">{label}</span>{area ? <textarea value={String(value ?? "")} onChange={(e) => set(path, e.target.value)} rows={4} className="min-h-[88px] w-full rounded-xl border border-white/10 bg-[#201726]/90 p-3 text-base text-white outline-none transition placeholder:text-bloom-white/30 focus:border-bloom-rose/70 focus:bg-[#261a2d]" placeholder={label} /> : <textarea value={String(value ?? "")} onChange={(e) => set(path, e.target.value)} rows={2} className="min-h-[52px] w-full rounded-xl border border-white/10 bg-[#201726]/90 p-3 text-base text-white outline-none transition placeholder:text-bloom-white/30 focus:border-bloom-rose/70 focus:bg-[#261a2d]" placeholder={label} />}</label>;
  };
  const ImageField = ({ label, path }: { label: string; path: string }) => <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-bloom-rose/40 bg-bloom-rose/5 p-2 text-xs text-bloom-white/70"><span>{label}</span><Upload className="h-4 w-4 text-bloom-pink" /><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) image(path, file); }} /></label>;
  const MusicField = () => <div className="space-y-2"><label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-bloom-rose/40 bg-bloom-rose/5 p-3 text-xs text-bloom-white/70"><span>{draft.musicUrl.startsWith("data:") ? "เลือกเพลงใหม่แล้ว" : "เลือกไฟล์เพลง"}<small className="mt-1 block text-bloom-white/40">รองรับ MP3, WAV, M4A</small></span><Upload className="h-4 w-4 text-bloom-pink" /><input type="file" accept="audio/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) audio(file); }} /></label>{draft.musicUrl && <button type="button" onClick={() => set("musicUrl", "")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300/30 px-3 py-2 text-xs text-red-200 transition-colors hover:bg-red-300/10"><Trash2 className="h-3.5 w-3.5" /> ลบเพลงนี้</button>}</div>;

  return <aside className="fixed inset-y-0 left-0 z-[70] w-[96vw] max-w-[540px] overflow-y-auto border-r border-white/10 bg-[#100817]/95 p-3 text-white shadow-2xl backdrop-blur-xl sm:w-full sm:max-w-md sm:p-5">
    <div className="mb-5 flex items-center justify-between sm:mb-6"><div><p className="text-[10px] uppercase tracking-[0.22em] text-bloom-pink sm:text-xs">Page editor</p><h2 className="mt-1 font-display text-2xl italic">Edit every section</h2></div><button onClick={() => setOpen(false)} aria-label="Close editor" className="rounded-full border border-white/10 p-2 text-bloom-white/80 hover:border-bloom-rose/40 hover:text-white"><X className="h-4 w-4" /></button></div>
    <div className="space-y-4 sm:space-y-6">
      <section className="rounded-2xl border border-bloom-rose/30 bg-gradient-to-br from-[#2a1230]/90 to-[#170f22]/90 p-3 sm:p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm text-bloom-rose">Privacy</h3><p className="mt-1 text-[11px] text-bloom-white/55">ตั้งรหัสให้ผู้รับก่อนเปิดหน้า</p></div><button type="button" role="switch" aria-checked={passwordEnabled} onClick={() => setPasswordEnabled(!passwordEnabled)} className={`relative h-6 w-11 rounded-full transition-colors ${passwordEnabled ? "bg-bloom-rose" : "bg-white/20"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${passwordEnabled ? "left-6" : "left-1"}`} /></button></div>{passwordEnabled && <label className="mt-4 block text-[11px] text-bloom-white/70">รหัสผ่านวันครบรอบ (ตัวเลข 8 หลัก)<input required inputMode="numeric" pattern="[0-9]{8}" maxLength={8} value={password} onChange={(event) => setPassword(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="เช่น 14022024" className="mt-2 w-full rounded-xl border border-white/10 bg-[#201726]/90 p-3 text-base tracking-[0.2em] text-white outline-none focus:border-bloom-rose/70" />{password.length > 0 && password.length < 8 && <span className="mt-1 block text-red-300">กรุณากรอกตัวเลขให้ครบ 8 หลัก</span>}</label>}{!passwordEnabled && <p className="mt-3 text-[11px] text-bloom-white/50">ผู้รับจะเปิดหน้าได้ทันทีโดยไม่ต้องใส่รหัสผ่าน</p>}</section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Opening</h3><div className="space-y-3"><Field label="Small heading" path="openingText.eyebrow" /><Field label="Title" path="openingText.title" /><Field label="Subtitle" path="openingText.subtitle" /><Field label="Button" path="openingText.cta" /></div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Music</h3><div className="space-y-3"><MusicField />{draft.musicUrl && <p className="text-[10px] uppercase tracking-[0.14em] text-bloom-white/50">เพลงจะใช้ในหน้าแชร์เมื่อกด Save</p>}</div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Story</h3><div className="space-y-3"><Field label="Line 1" path="introText.lines.0" /><Field label="Line 2" path="introText.lines.1" /><Field label="Line 3" path="introText.lines.2" /><Field label="Button" path="introText.cta" /></div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Photos</h3><div className="space-y-3"><ImageField label="Main photo" path="photos.main" /><ImageField label="Photo 2" path="photos.secondary.0" /><ImageField label="Photo 3" path="photos.secondary.1" /><ImageField label="Photo 4" path="photos.secondary.2" /><Field label="Caption" path="photos.caption" area /></div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Galaxy section</h3><div className="space-y-3"><Field label="Small heading" path="galaxyIntro.eyebrow" /><Field label="Title" path="galaxyIntro.title" /><Field label="Hint" path="galaxyIntro.hint" />{draft.galaxyPhotos.map((photo, i) => <ImageField key={photo.id} label={`Galaxy photo ${i + 1}`} path={`galaxyPhotos.${i}.image`} />)}</div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Counter</h3><div className="space-y-3"><Field label="ข้อความนำ" path="counterText.intro" /><Field label="Days" path="counterText.days" /><Field label="Hours" path="counterText.hours" /><Field label="Minutes" path="counterText.minutes" /><Field label="Seconds" path="counterText.seconds" /><Field label="วันเริ่มต้น (YYYY-MM-DDTHH:mm:ss)" path="couple.anniversaryDate" /></div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Timeline</h3><div className="space-y-3"><Field label="หัวข้อ section" path="timelineTitle" />{draft.memories.map((memory, i) => <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-[#201726]/70 p-3"><Field label={`เหตุการณ์ ${i + 1}`} path={`memories.${i}.title`} /><Field label="วันที่" path={`memories.${i}.date`} /><Field label="รายละเอียด" path={`memories.${i}.description`} area /><ImageField label="เลือกรูป" path={`memories.${i}.image`} /></div>)}</div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Little Moments</h3><div className="space-y-3"><Field label="หัวข้อ section" path="memoryCardsTitle" />{draft.memoryCards.map((card, i) => <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-[#201726]/70 p-3"><Field label={`การ์ด ${i + 1}`} path={`memoryCards.${i}.title`} /><Field label="ข้อความ" path={`memoryCards.${i}.body`} area /><ImageField label="เลือกรูป" path={`memoryCards.${i}.image`} /></div>)}</div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Secret message</h3><div className="space-y-3"><Field label="ข้อความเปิด" path="secretMessage.prompt" area /><Field label="ปุ่ม" path="secretMessage.cta" /><Field label="ข้อความปิดท้าย" path="secretMessage.closing" area /></div></section>
      <section className="rounded-2xl border border-white/10 bg-[#160e1d]/80 p-3 sm:p-4"><h3 className="mb-3 text-sm text-bloom-rose">Final section</h3><div className="space-y-3"><Field label="Title" path="finalScene.title" /><Field label="ข้อความ" path="finalScene.body" area /><Field label="Sign off" path="finalScene.signOff" /><Field label="ชื่อของคุณ" path="couple.name" /></div></section>
    </div>
    <div className="sticky bottom-0 mt-7 flex gap-2 border-t border-white/10 bg-[#100817] py-3 sm:py-4"><button onClick={save} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-bloom-rose px-4 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(255,93,162,0.28)]"><Save className="h-4 w-4" /> Save</button><button onClick={reset} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-xs text-bloom-white/80"><RotateCcw className="h-4 w-4" /> Reset</button></div>
  </aside>;
}
