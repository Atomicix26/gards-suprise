"use client";

import { useState } from "react";
import AnniversaryExperience from "@/components/AnniversaryExperience";
import { defaultContent, type AnniversaryContent } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/security";
import { uploadMusic } from "@/lib/media";

async function uploadMedia(content: AnniversaryContent, slug: string) {
  if (!supabase) return content;
  const copy = structuredClone(content) as AnniversaryContent;
  const mediaPaths = ["photos.main", "photos.secondary.0", "photos.secondary.1", "photos.secondary.2", ...copy.memories.map((_, i) => `memories.${i}.image`), ...copy.memoryCards.map((_, i) => `memoryCards.${i}.image`), ...copy.galaxyPhotos.map((_, i) => `galaxyPhotos.${i}.image`)];
  for (const path of mediaPaths) {
    const keys = path.split(".");
    let target: Record<string, unknown> = copy as unknown as Record<string, unknown>;
    keys.slice(0, -1).forEach((key) => { target = target[key] as Record<string, unknown>; });
    const value = target[keys[keys.length - 1]];
    if (typeof value !== "string" || !value.startsWith("data:")) continue;
    const response = await fetch(value);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1]?.replace("jpeg", "jpg") || (path === "musicUrl" ? "mp3" : "jpg");
    const storagePath = `${slug}/${path.replaceAll(".", "-")}.${extension}`;
    const upload = await supabase.storage.from("anniversary-photos").upload(storagePath, blob, { contentType: blob.type, upsert: true });
    if (upload.error) throw upload.error;
    target[keys[keys.length - 1]] = supabase.storage.from("anniversary-photos").getPublicUrl(storagePath).data.publicUrl;
  }
  return copy;
}

export default function CreateAnniversary() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (draft: AnniversaryContent, password: string) => {
    setError("");
    if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase ใน .env.local");
    if (password && !/^\d{8}$/.test(password)) { setError("รหัสผ่านต้องเป็นตัวเลขวันที่ 8 หลัก"); throw new Error("Password must be an 8 digit date"); }
    setBusy(true);
    try {
      const name = draft.couple.name.trim() || "our-story";
      const slug = `${name}-${Date.now().toString(36)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const content = await uploadMusic(await uploadMedia(draft, slug), slug);
      const page = { slug, sender_name: content.couple.name, partner_name: content.couple.partner, anniversary_date: content.couple.anniversaryDate.slice(0, 10), content, ...(password ? { password_hash: await hashPassword(password) } : {}) };
      const { error: insertError } = await supabase.from("anniversary_pages").insert(page);
      if (insertError) throw insertError;
      setResult(`${window.location.origin}/p/${slug}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "บันทึกไม่สำเร็จ";
      setError(message.includes("password_hash") || message.includes("save_anniversary_page") ? `${message} กรุณารัน supabase.sql ใน Supabase SQL Editor` : message);
      throw caught;
    }
    finally { setBusy(false); }
  };
  if (result) return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-void-950/90 px-6 backdrop-blur"><div className="card-glass w-full max-w-lg rounded-2xl p-7 text-center"><h2 className="font-display text-3xl italic">ลิงก์ของคุณพร้อมแล้ว</h2><input readOnly value={result} className="mt-6 w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white/70" /><p className="mt-4 text-xs text-bloom-white/50">ส่งลิงก์นี้พร้อมรหัสวันที่ที่ตั้งไว้ให้คนสำคัญ</p><a href={result} className="mt-5 inline-block rounded-full bg-bloom-rose px-6 py-3 text-sm">เปิดหน้าของคุณ</a></div></div>;
  return <><AnniversaryExperience initial={defaultContent} editable autoOpen onSave={save} /><div className="fixed right-6 top-6 z-[75] max-w-64 rounded-xl border border-bloom-rose/30 bg-void-950/90 p-4 text-xs shadow-glow-sm backdrop-blur">{busy ? "กำลังอัปโหลดและบันทึก..." : error}</div></>;
}
