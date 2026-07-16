import { supabase } from "@/lib/supabase";

export async function uploadBackdropImage(file: File): Promise<string> {
  // Generate a unique filename
  const fileName = `backdrop_${Date.now()}_${file.name}`;

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from("backdrops")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload backdrop: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("backdrops")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function getBackdropUrl(): Promise<string | null> {
  try {
    // List all backdrop files
    const { data, error } = await supabase.storage
      .from("backdrops")
      .list();

    if (error || !data || data.length === 0) {
      return null;
    }

    // Get the most recent backdrop (last uploaded)
    const latestFile = data[data.length - 1];
    if (!latestFile) return null;

    const { data: urlData } = supabase.storage
      .from("backdrops")
      .getPublicUrl(latestFile.name);

    return urlData.publicUrl;
  } catch (err) {
    console.error("Error fetching backdrop:", err);
    return null;
  }
}
