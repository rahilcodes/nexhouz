import { spawn } from "child_process";
import path from "path";

console.log("Starting deployment script...");

const localDir = path.resolve(process.cwd(), "out");
const remoteTarget = "u145261415@145.79.209.104:public_html";
const port = "65002";
const password = "ALnex@786";

console.log(`Local directory: ${localDir}`);
console.log(`Remote target: ${remoteTarget} (Port: ${port})`);

// Spawn scp process in the "out" folder
const child = spawn(
  "scp",
  [
    "-P", port,
    "-o", "StrictHostKeyChecking=no",
    "-r",
    ".",
    remoteTarget
  ],
  {
    cwd: localDir,
    stdio: ["pipe", "pipe", "pipe"]
  }
);

child.stdout.on("data", (data) => {
  const str = data.toString();
  console.log(`[STDOUT] ${str.trim()}`);
});

child.stderr.on("data", (data) => {
  const str = data.toString();
  console.log(`[STDERR] ${str.trim()}`);
  
  // Look for password prompt (case-insensitive)
  if (str.toLowerCase().includes("password")) {
    console.log("Password prompt detected. Sending password...");
    child.stdin.write(password + "\n");
  }
});

child.on("close", (code) => {
  console.log(`SCP process exited with code ${code}`);
  if (code === 0) {
    console.log("=== DEPLOYMENT COMPLETED SUCCESSFULLY ===");
  } else {
    console.error("=== DEPLOYMENT FAILED ===");
    process.exit(1);
  }
});
