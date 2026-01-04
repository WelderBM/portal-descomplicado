import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Carrega variáveis de ambiente manualmente (simples, sem dotenv para evitar deps extras)
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (e) {
    console.warn(
      "⚠️  Aviso: .env.local não encontrado. Certifique-se de configurar as variáveis de ambiente."
    );
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("❌ Erro: Configuração do Supabase (URL ou Key) ausente.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
