import * as ftp from "basic-ftp";
import path from "path";

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Log FTP commands
  
  const localDir = path.resolve(process.cwd(), "out");
  
  try {
    console.log("=== Starting FTP Deployment ===");
    console.log(`Local directory: ${localDir}`);
    console.log("Connecting to FTP server on port 21...");
    
    await client.access({
      host: "145.79.209.104",
      user: "u145261415",
      password: "ALnex@786",
      secure: false // Hostinger standard FTP is usually non-SSL or explicit TLS. Let's use standard first.
    });
    
    console.log("FTP connected successfully! Navigating to public_html...");
    
    // Ensure we are in public_html
    await client.cd("public_html");
    
    console.log("Uploading all files from 'out' to 'public_html' recursively...");
    await client.uploadFromDir(localDir);
    
    console.log("=== DEPLOYMENT SUCCESSFULLY COMPLETED ===");
  } catch (err: any) {
    console.error("FTP Deployment failed:", err.message || err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
