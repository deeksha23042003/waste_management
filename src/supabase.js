// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rdxbrzfvjahdkzmpqwuc.supabase.co"; // replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeGJyemZ2amFoZGt6bXBxd3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MzcyMjcsImV4cCI6MjA4MTUxMzIyN30.LvLebc-QfsnPpbp1a3H01nxFCp6ClRQFSEyDSWiKlgw"; // replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
