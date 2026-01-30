
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://lcumdhkllbjioqtamgco.supabase.co';
const supabaseAnonKey = 'sb_publishable_6zKl-Lx7C59pjKx1Mpc35g_Z6pSFDCG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
