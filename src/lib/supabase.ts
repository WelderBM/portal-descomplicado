import { createClient } from "@supabase/supabase-js";

// Cliente Supabase configurado para acesso público (busca)
// Para operações administrativas (ETL), usaremos a Service Role Key em scripts separados
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase URL or Key not found. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
