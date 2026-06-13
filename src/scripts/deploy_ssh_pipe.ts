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

console.log("=== Starting SSH Stdin Piping Deployment ===");
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
    
    // Ensure remote directory exists
    try {
      await ensureRemoteDir(remoteDir, createdDirs);
    } catch (dirErr: any) {
      console.error(`Failed to create remote directory ${remoteDir}:`, dirErr.message);
      conn.end();
      process.exit(1);
    }
    
    // Upload file via cat > remotePath
    process.stdout.write(`Uploading [${uploadedCount + 1}/${files.length}]: ${relativePath} ... `);
    
    conn.exec(`cat > "${remotePath}"`, (err, stream) => {
      if (err) {
        console.log("FAILED");
        console.error(`Exec error:`, err.message);
        conn.end();
        process.exit(1);
      }
      
      const fileData = fs.readFileSync(localPath);
      
      stream.on("close", (code: any, signal: any) => {
        if (code === 0) {
          console.log("DONE");
          uploadedCount++;
          uploadNext();
        } else {
          console.log("FAILED");
          console.error(`Remote process exited with code ${code}`);
          conn.end();
          process.exit(1);
        }
      }).on("data", (data: any) => {
        // Handle any output (should be none)
      });
      
      stream.write(fileData);
      stream.end();
    });
  }
  
  uploadNext();
}).on("error", (err) => {
  console.error("SSH Connection Error:", err.message);
  process.exit(1);
}).connect(config);

// Helper function to recursively ensure remote directory exists
function ensureRemoteDir(remoteDir: string, createdDirs: Set<string>): Promise<void> {
  if (remoteDir === "." || remoteDir === "/" || !remoteDir || createdDirs.has(remoteDir)) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    conn.exec(`mkdir -p "${remoteDir}"`, (err, stream) => {
      if (err) return reject(err);
      
      stream.on("close", (code) => {
        if (code === 0) {
          createdDirs.add(remoteDir);
          resolve();
        } else {
          reject(new Error(`mkdir -p exited with code ${code}`));
        }
      });
    });
  });
}
