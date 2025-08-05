import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://vnvdqwbyamxuqylqsttq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmRxd2J5YW14dXF5bHFzdHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzYxNTMsImV4cCI6MjA2OTg1MjE1M30.1Jp4BVEPqUvxKjTQBeuLDJGpbaEg_p4m2hUQBUV5CY4';
export const supabase = createClient(supabaseUrl, supabaseKey);
