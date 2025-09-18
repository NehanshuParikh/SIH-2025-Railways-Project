// server.js
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// 1️⃣ Create HTTP server from express app
const server = createServer(app);

// 2️⃣ Attach socket.io to the HTTP server
const io = new Server(server, {
  cors: { origin: "*" }, // later restrict to frontend domain
});


// 3️⃣ Handle socket connections
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 4️⃣ Export io so controllers can use it
export { io };

// 5️⃣ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
