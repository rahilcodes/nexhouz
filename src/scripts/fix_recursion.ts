import { Client } from "pg";

async function fixRecursion() {
  const client = new Client({
    host: 'db.yjxtmgkkwlyfkzjonwvb.supabase.co',
    port: 5432,
    user: 'postgres',
    password: '7hTvZ/)p6qS2^^_',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Connecting to PostgreSQL to fix recursion...");
    await client.connect();

    console.log("Altering policies on public.profiles...");
    
    // Drop the recursive policy
    await client.query(`DROP POLICY IF EXISTS "Allow admin write on profiles" ON public.profiles;`);
    
    // Create non-recursive policies for insert, update, delete
    await client.query(`
      CREATE POLICY "Allow admin insert on profiles" ON public.profiles FOR INSERT TO authenticated 
      WITH CHECK (
        role = 'admin' OR 
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent')
      );
    `);

    await client.query(`
      CREATE POLICY "Allow admin update on profiles" ON public.profiles FOR UPDATE TO authenticated 
      USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent')
      );
    `);

    await client.query(`
      CREATE POLICY "Allow admin delete on profiles" ON public.profiles FOR DELETE TO authenticated 
      USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent')
      );
    `);

    console.log("Successfully fixed infinite recursion policies on profiles table!");
  } catch (err: any) {
    console.error("Failed to alter policies:", err.message || err);
  } finally {
    await client.end();
  }
}

fixRecursion();
