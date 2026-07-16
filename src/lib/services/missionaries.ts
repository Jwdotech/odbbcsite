import { supabase } from "@/lib/supabase";
import { Missionary } from "@/types/missionary";

export async function getMissionaries(): Promise<Missionary[]> {
  const { data, error } = await supabase
    .from("missionaries")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Missionary[];
}

export async function addMissionary(
  fullName: string,
  location: string
): Promise<Missionary> {
  const { data, error } = await supabase
    .from("missionaries")
    .insert({ full_name: fullName, location: location || null, active: true })
    .select()
    .single();

  if (error) throw error;
  return data as Missionary;
}

export async function addMissionariesBulk(
  missionaries: { full_name: string; location?: string | null }[]
): Promise<Missionary[]> {
  const { data, error } = await supabase
    .from("missionaries")
    .insert(missionaries)
    .select();

  if (error) throw error;
  return (data ?? []) as Missionary[];
}

export async function toggleMissionaryActive(
  id: string,
  active: boolean
): Promise<void> {
  const { error } = await supabase
    .from("missionaries")
    .update({ active })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteMissionary(id: string): Promise<void> {
  const { error } = await supabase.from("missionaries").delete().eq("id", id);

  if (error) throw error;
}
