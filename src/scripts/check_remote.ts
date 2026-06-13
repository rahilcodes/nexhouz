import { Client } from "ssh2";

const conn = new Client();

const config = {
  host: "145.79.209.104",
  port: 65002,
  username: "u145261415",
  password: "ALnex@786"
};

conn.on("ready", () => {
  console.log("Connected. Checking files...");
  
  conn.exec("ls -la && echo '--- public_html: ---' && ls -la public_html", (err, stream) => {
    if (err) {
      console.error("Exec error:", err.message);
      conn.end();
      process.exit(1);
    }
    
    stream.on("close", (code: any) => {
      console.log(`\nCommand exited with code ${code}`);
      conn.end();
      process.exit(0);
    }).on("data", (data: any) => {
      process.stdout.write("[STDOUT] " + data.toString());
    });
    
    stream.stderr.on("data", (data: any) => {
      process.stdout.write("[STDERR] " + data.toString());
    });
  });
}).on("error", (err) => {
  console.error("Connection error:", err.message);
  process.exit(1);
}).connect(config);
