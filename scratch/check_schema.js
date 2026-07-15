const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://yjxtmgkkwlyfkzjonwvb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeHRtZ2trd2x5Zmt6am9ud3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjU2MTEsImV4cCI6MjA5NjUwMTYxMX0.ILbPPBOW9xFSPjbffOE2z4gEaLE5qoSYT4liTT_JZq0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.from("blog_posts").select("*").limit(1);
  if (error) {
    console.error("blog_posts query error:", error);
  } else {
    console.log("blog_posts exists! Sample row:", data);
  }
}

main();
