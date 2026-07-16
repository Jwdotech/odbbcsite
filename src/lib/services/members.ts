import { supabase } from "@/lib/supabase";
import { Member } from "@/types/member";

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw new Error(`Failed to fetch members: ${error.message}`);
  return (data ?? []) as Member[];
}

export async function addMember(
  fullName: string,
  gender: "Male" | "Female"
): Promise<Member> {
  const { data, error } = await supabase
    .from("members")
    .insert({ full_name: fullName, gender, active: true })
    .select()
    .single();

  if (error) throw new Error(`Failed to add member: ${error.message}`);
  return data as Member;
}

export async function addMembersBulk(
  members: { full_name: string; gender: "Male" | "Female" }[]
): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .insert(members)
    .select();

  if (error) throw new Error(`Failed to add members: ${error.message}`);
  return (data ?? []) as Member[];
}

export async function toggleMemberActive(
  id: string,
  active: boolean
): Promise<void> {
  const { error } = await supabase
    .from("members")
    .update({ active })
    .eq("id", id);

  if (error) throw new Error(`Failed to update member: ${error.message}`);
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete member: ${error.message}`);
}

export async function updateMember(
  id: string,
  fullName: string,
  gender: "Male" | "Female"
): Promise<Member> {
  const { data, error } = await supabase
    .from("members")
    .update({ full_name: fullName, gender })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update member: ${error.message}`);
  return data as Member;
}

export async function deleteAllMembers(): Promise<void> {
  const { error } = await supabase
    .from("members")
    .delete()
    .not("id", "is", null);

  if (error) throw new Error(`Failed to delete all members: ${error.message}`);
}
