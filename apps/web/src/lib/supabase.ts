import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = import.meta.env.SUPABASE_KEY || import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "dummy-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

