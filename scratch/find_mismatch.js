const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../src/app/admin/page.tsx");
const content = fs.readFileSync(filePath, "utf-8");

let braces = 0;
let parens = 0;
let curlies = [];
let parentheses = [];

const lines = content.split("\n");
let lineNum = 1;
let lineChar = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  if (char === "\n") {
    lineNum++;
  }
  
  if (char === "{") {
    braces++;
    curlies.push({ pos: i, line: lineNum, context: content.slice(i, i + 40).replace(/\n/g, " ") });
  } else if (char === "}") {
    braces--;
    curlies.pop();
  } else if (char === "(") {
    parens++;
    parentheses.push({ pos: i, line: lineNum });
  } else if (char === ")") {
    parens--;
    parentheses.pop();
  }
}

console.log("Braces balance:", braces);
console.log("Parens balance:", parens);
console.log("Last 5 unclosed curlies:");
curlies.slice(-5).forEach(c => {
  console.log(`Line ${c.line}: ${c.context}`);
});
