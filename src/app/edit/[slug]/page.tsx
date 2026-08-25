"use client";

import { useEffect, useState } from "react";
import AnniversaryExperience from "@/components/AnniversaryExperience";
import { defaultContent, type AnniversaryContent } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/security";
import { uploadMusic } from "@/lib/media";

export default function EditAnniversary({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<AnniversaryContent | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!supabase) { setError("Supabase is not configured."); return; }
    supabase.rpc("edit_anniversary_page", { page_slug: params.slug }).then(({ data, error: queryError }) => {
      if (queryError || !data) setError("ไม่พบหน้าความทรงจำนี้");
      else setContent({ ...defaultContent, ...(data as Partial<AnniversaryContent>) });
    });
  }, [params.slug]);
  const save = async (next: AnniversaryContent, password: string) => {
    if (!supabase) throw new Error("ยังไม่ได้ตั้งค่า Supabase");
    const contentWithMusic = await uploadMusic(next, params.slug);
    const { data, error: updateError } = await supabase.rpc("save_anniversary_page", { page_slug: params.slug, next_content: contentWithMusic, next_password_hash: password ? await hashPassword(password) : "" });
    if (updateError) throw new Error(`บันทึกไม่สำเร็จ: ${updateError.message}`);
    if (!data) throw new Error("ไม่พบหน้าที่ต้องการบันทึก หรือยังไม่ได้รัน supabase.sql");
  };
  if (error) return <main className="flex min-h-screen items-center justify-center bg-void-gradient text-bloom-white">{error}</main>;
  if (!content) return <main className="flex min-h-screen items-center justify-center bg-void-gradient text-bloom-white/60">กำลังโหลดหน้าแก้ไข...</main>;
  return <AnniversaryExperience initial={content} editable onSave={save} />;
}
