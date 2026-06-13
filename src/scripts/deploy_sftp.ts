import { Client } from "ssh2";
import fs from "fs";
import path from "path";

const conn = new Client();

const config = {
  host: "145.79.209.104",
  port: 65002,
  username: "u145261415",
  password: "ALnex@786"
};

const localBaseDir = path.resolve(process.cwd(), "out");
const remoteBaseDir = "public_html";

console.log("=== Starting SFTP Deployment ===");
console.log(`Local source: ${localBaseDir}`);
console.log(`Remote dest: ${remoteBaseDir}`);

// Helper to recursively walk a directory
function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Connect to remote server
conn.on("ready", () => {
  console.log("SSH connection established successfully!");
  
  conn.sftp((err, sftp) => {
    if (err) {
      console.error("Failed to start SFTP session:", err.message);
      conn.end();
      process.exit(1);
    }
    
    console.log("SFTP session started. Walking local out directory...");
    const files = walk(localBaseDir);
    console.log(`Found ${files.length} files to upload.`);
    
    let uploadedCount = 0;
    const createdDirs = new Set<string>();
    
    async function uploadNext() {
      if (uploadedCount >= files.length) {
        console.log("\n=== ALL FILES UPLOADED SUCCESSFULLY ===");
        conn.end();
        process.exit(0);
      }
      
      const localPath = files[uploadedCount];
      const relativePath = path.relative(localBaseDir, localPath).replace(/\\/g, "/");
      const remotePath = `${remoteBaseDir}/${relativePath}`;
      const remoteDir = path.dirname(remotePath).replace(/\\/g, "/");
      
      // Ensure remote directories exist
      try {
        await ensureRemoteDir(sftp, remoteDir, createdDirs);
      } catch (dirErr: any) {
        console.error(`Failed to create remote directory ${remoteDir}:`, dirErr.message);
        conn.end();
        process.exit(1);
      }
      
      // Upload the file
      process.stdout.write(`Uploading [${uploadedCount + 1}/${files.length}]: ${relativePath} ... `);
      sftp.fastPut(localPath, remotePath, (putErr) => {
        if (putErr) {
          console.log("FAILED");
          console.error(`Error uploading ${relativePath}:`, putErr.message);
          conn.end();
          process.exit(1);
        }
        console.log("DONE");
        uploadedCount++;
        uploadNext();
      });
    }
    
    uploadNext();
  });
}).on("error", (err) => {
  console.error("SSH Connection Error:", err.message);
  process.exit(1);
}).connect(config);

// Helper function to recursively ensure remote directory exists
async function ensureRemoteDir(sftp: any, remoteDir: string, createdDirs: Set<string>): Promise<void> {
  if (remoteDir === "." || remoteDir === "/" || !remoteDir || createdDirs.has(remoteDir)) {
    return;
  }
  
  // Create parent directory first if needed
  const parentDir = path.dirname(remoteDir).replace(/\\/g, "/");
  await ensureRemoteDir(sftp, parentDir, createdDirs);
  
  return new Promise((resolve, reject) => {
    sftp.mkdir(remoteDir, (err: any) => {
      // If error is code 4 (failure), directory probably already exists, which is fine
      createdDirs.add(remoteDir);
      resolve();
    });
  });
}
