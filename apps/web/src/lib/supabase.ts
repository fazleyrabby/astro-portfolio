import { createClient } from "@supabase/supabase-js";

const env = (typeof import.meta !== "undefined" && import.meta?.env) ? import.meta.env : process.env;
const supabaseUrl = env.SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = env.SUPABASE_KEY || env.SUPABASE_ANON_KEY || "dummy-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

