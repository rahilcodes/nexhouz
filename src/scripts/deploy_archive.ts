import { Client } from "ssh2";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const conn = new Client();

const config = {
  host: "145.79.209.104",
  port: 65002,
  username: "u145261415",
  password: "ALnex@786"
};

const localArchive = path.resolve(process.cwd(), "build.tar.gz");
const remoteArchive = "build.tar.gz";

console.log("=== Starting Optimized Archive Deployment ===");

// 1. Create local archive
try {
  console.log("Compressing local 'out' directory into build.tar.gz...");
  if (fs.existsSync(localArchive)) {
    fs.unlinkSync(localArchive);
  }
  execSync(`tar -czf "${localArchive}" -C out .`, { stdio: "inherit" });
  console.log("Archive created successfully.");
} catch (err: any) {
  console.error("Failed to create local archive:", err.message || err);
  process.exit(1);
}

const stats = fs.statSync(localArchive);
const fileSize = stats.size;
console.log(`Archive size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

// 2. Connect via SSH
console.log("Connecting to Hostinger remote server...");
conn.on("ready", () => {
  console.log("SSH connection established successfully!");
  
  // Create remote public_html folder if it doesn't exist
  conn.exec('mkdir -p public_html', (mkdirErr, mkdirStream) => {
    if (mkdirErr) {
      console.error("Failed to create remote directory:", mkdirErr.message);
      cleanup();
      conn.end();
      process.exit(1);
    }
    
    mkdirStream.on("close", () => {
      // 3. Upload build.tar.gz via cat > build.tar.gz
      console.log("Uploading archive to remote server...");
      
      conn.exec(`cat > "${remoteArchive}"`, (uploadErr, uploadStream) => {
        if (uploadErr) {
          console.error("Failed to start remote upload process:", uploadErr.message);
          cleanup();
          conn.end();
          process.exit(1);
        }
        
        const fileStream = fs.createReadStream(localArchive);
        let uploadedBytes = 0;
        
        fileStream.on("data", (chunk) => {
          uploadedBytes += chunk.length;
          const pct = ((uploadedBytes / fileSize) * 100).toFixed(1);
          process.stdout.write(`\rUploading: ${pct}% (${(uploadedBytes / 1024 / 1024).toFixed(2)} MB / ${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        uploadStream.on("close", (code) => {
          console.log("\nUpload finished.");
          if (code !== 0) {
            console.error(`Upload command exited with error code ${code}`);
            cleanup();
            conn.end();
            process.exit(1);
          }
          
          // 4. Remote extraction
          console.log("Extracting archive on remote server...");
          conn.exec(`tar -xzf "${remoteArchive}" -C public_html/`, (extractErr, extractStream) => {
            if (extractErr) {
              console.error("Failed to execute remote extraction:", extractErr.message);
              cleanup();
              conn.end();
              process.exit(1);
            }
            
            extractStream.on("close", (extractCode) => {
              if (extractCode !== 0) {
                console.error(`Extraction failed with exit code ${extractCode}`);
                cleanup();
                conn.end();
                process.exit(1);
              }
              
              console.log("Archive extracted successfully on server.");
              
              // 5. Cleanup remote archive
              console.log("Cleaning up remote archive...");
              conn.exec(`rm "${remoteArchive}"`, (rmErr, rmStream) => {
                rmStream.on("close", () => {
                  console.log("Remote cleanup complete.");
                  cleanup();
                  conn.end();
                  console.log("\n=== DEPLOYMENT SUCCESSFULLY COMPLETED ===");
                  process.exit(0);
                });
              });
            });
          });
        });
        
        fileStream.pipe(uploadStream);
      });
    });
  });
}).on("error", (err) => {
  console.error("SSH connection error:", err.message || err);
  cleanup();
  process.exit(1);
}).connect(config);

function cleanup() {
  try {
    if (fs.existsSync(localArchive)) {
      console.log("Cleaning up local archive...");
      fs.unlinkSync(localArchive);
    }
  } catch (err: any) {
    console.error("Failed to delete local archive:", err.message);
  }
}
