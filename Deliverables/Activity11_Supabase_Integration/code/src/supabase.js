import { createClient } from '@supabase/supabase-js'

// values come from .env.local (Project URL + Publishable key from the Supabase dashboard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
