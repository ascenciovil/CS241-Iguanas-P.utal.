import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPAURL;
const supabaseKey = import.meta.env.VITE_SUPAKEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertDate(table: string, data: unknown): Promise<Boolean>{
    const { error } = await supabase.from(table).insert(data);

    return !error; 
}//comienzo