import { supabase } from "@/lib/supabase";
import type { AnniversaryContent } from "@/lib/content";

export async function uploadMusic(content: AnniversaryContent, slug: string) {
  if (!supabase || !content.musicUrl.startsWith("data:")) return content;
  const response = await fetch(content.musicUrl);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1]?.replace("mpeg", "mp3") || "mp3";
  const storagePath = `${slug}/music.${extension}`;
  const upload = await supabase.storage.from("anniversary-photos").upload(storagePath, blob, { contentType: blob.type, upsert: true });
  if (upload.error) throw upload.error;
  return { ...content, musicUrl: supabase.storage.from("anniversary-photos").getPublicUrl(storagePath).data.publicUrl };
}