// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

// URL publique du projet Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Clé côté serveur (SERVICE ROLE) pour upload privé
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are not set')
}

// Créer le client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
