import { createClient } from "@supabase/supabase-js";

let sql: any;
try {
    const supabaseUrl = process.env.SUPABASE_URL;
    // Use the Service Role Key here
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase URL or Service Role Key");
    }
    sql = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Database connected successfully (Service Role)");
}
catch (error) {
    console.log("❌ Database connection failed");
    console.log(error);
}
export default sql;
