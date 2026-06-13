import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(process.cwd(), "src");

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (stat.isFile() && (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".css"))) {
      callback(fullPath);
    }
  }
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Replace text-xs up to text-xs with text-xs
  content = content.replace(/text-\[7px\]/g, "text-xs");
  content = content.replace(/text-\[7\.5px\]/g, "text-xs");
  content = content.replace(/text-\[8px\]/g, "text-xs");
  content = content.replace(/text-\[9px\]/g, "text-xs");
  content = content.replace(/text-\[10px\]/g, "text-xs");
  content = content.replace(/text-\[11px\]/g, "text-sm"); // 11px becomes sm (14px) for better readability
  
  // Also clean up any smaller custom text sizes in sliders or charts
  content = content.replace(/text-\[7\.5px\]/g, "text-xs");
  content = content.replace(/text-\[8\.5px\]/g, "text-xs");
  content = content.replace(/text-\[9\.5px\]/g, "text-xs");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated text sizes in: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log("=== Adjusting font sizes for senior readability (60+ years) ===");
walkDir(SRC_DIR, processFile);
console.log("=== Font size optimization complete ===");
