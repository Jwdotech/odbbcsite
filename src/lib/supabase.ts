import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !/^https?:\/\//i.test(supabaseUrl)) {
	throw new Error(
		"Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Add your Supabase Project URL to .env.local (NEXT_PUBLIC_SUPABASE_URL) and restart the dev server."
	);
}

if (!supabaseAnonKey) {
	throw new Error(
		"Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add your anon public key to .env.local (NEXT_PUBLIC_SUPABASE_ANON_KEY) and restart the dev server."
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
