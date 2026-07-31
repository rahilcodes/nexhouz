import { createClient } from "@supabase/supabase-js";

// Placeholder fallbacks keep the client constructible when env vars are absent
// (e.g. local dev without .env.local) — queries then fail gracefully and the
// UI falls back to its bundled offline data.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
