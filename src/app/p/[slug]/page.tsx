"use client";

import { FormEvent, useEffect, useState } from "react";
import AnniversaryExperience from "@/components/AnniversaryExperience";
import { defaultContent, type AnniversaryContent } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/security";

export default function PublicAnniversary({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<AnniversaryContent | null>(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (!supabase) { setError("Supabase is not configured."); setChecking(false); return; }
    supabase.rpc("unlock_anniversary_page", { page_slug: params.slug, provided_hash: "" }).then(({ data }) => {
      if (data) setContent({ ...defaultContent, ...(data as Partial<AnniversaryContent>) });
      setChecking(false);
    });
  }, [params.slug]);
  const unlock = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    if (!supabase) { setError("Supabase is not configured."); setBusy(false); return; }
    const { data, error: queryError } = await supabase.rpc("unlock_anniversary_page", { page_slug: params.slug, provided_hash: await hashPassword(password) });
    if (queryError || !data) setError("รหัสผ่านไม่ถูกต้อง หรือไม่พบหน้านี้");
    else setContent({ ...defaultContent, ...(data as Partial<AnniversaryContent>) });
    setBusy(false);
  };
  if (error) return <main className="flex min-h-screen items-center justify-center bg-void-gradient px-6 text-center text-bloom-white"><div><h1 className="font-display text-4xl italic">ขออภัย</h1><p className="mt-3 text-bloom-white/60">{error}</p><a href="/" className="mt-6 inline-block text-bloom-pink">สร้างหน้าใหม่</a></div></main>;
  if (checking) return <main className="flex min-h-screen items-center justify-center bg-void-gradient text-bloom-white/60">กำลังตรวจสอบหน้า...</main>;
  if (!content) return <main className="flex min-h-screen items-center justify-center bg-void-gradient px-6 text-bloom-white"><form onSubmit={unlock} className="card-glass w-full max-w-sm rounded-2xl p-7 text-center"><h1 className="font-display text-4xl italic">A private story</h1><p className="mt-3 text-sm text-bloom-white/60">กรอกรหัสวันที่ 8 หลักเพื่อเปิดความทรงจำนี้</p><input autoFocus required inputMode="numeric" pattern="[0-9]{8}" maxLength={8} value={password} onChange={(event) => setPassword(event.target.value.replace(/\D/g, "").slice(0, 8))} className="mt-6 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white tracking-[0.2em]" placeholder="เช่น 14022024" />{error && <p className="mt-3 text-sm text-red-300">{error}</p>}<button disabled={busy} className="mt-5 w-full rounded-lg bg-bloom-rose px-5 py-3 font-semibold disabled:opacity-60">{busy ? "กำลังเปิด..." : "ปลดล็อก"}</button></form></main>;
  return <AnniversaryExperience initial={content} />;
}
