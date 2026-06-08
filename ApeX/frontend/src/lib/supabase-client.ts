import { createClient } from "@supabase/supabase-js";

function getPublicSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase public environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined in frontend/.env.local.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseHealth = async (tableName = "your_table_name") => {
  const { data, error } = await supabase.from(tableName).select("id").limit(1);

  if (error) {
    console.error("Supabase health check failed:", error);
    throw error;
  }

  return data;
};
