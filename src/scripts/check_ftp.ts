import net from "net";

const host = "145.79.209.104";

console.log("=== Checking FTP/SFTP ports on Hostinger ===");

const ports = [21, 22, 65002];

ports.forEach((port) => {
  const socket = new net.Socket();
  socket.setTimeout(3000);
  
  socket.on("connect", () => {
    console.log(`Port ${port} is OPEN!`);
    socket.destroy();
  }).on("timeout", () => {
    console.log(`Port ${port} connection TIMEOUT.`);
    socket.destroy();
  }).on("error", (err) => {
    console.log(`Port ${port} connection FAILED: ${err.message}`);
  }).connect(port, host);
});
