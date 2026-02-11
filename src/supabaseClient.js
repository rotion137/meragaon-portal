import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oicokismjnzeetjumakz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pY29raXNtam56ZWV0anVtYWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjYxMTEsImV4cCI6MjA4NjQwMjExMX0.SG3ODlNUteCqyLVuTQqsGW27gs7QtCZfL7AohHSzPMw'

export const supabase = createClient(supabaseUrl, supabaseKey)