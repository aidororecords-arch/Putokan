const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"]
});

const PORT = process.env.PORT || 3000;
const players = new Map();

app.disable("x-powered-by");
app.get("/health", (_req, res) => res.json({ ok: true, service: "Bomber Tanks Socket.IO server", players: players.size }));
app.use(express.static(path.join(__dirname)));

function publicPlayers() {
  return Object.fromEntries(players.entries());
}
function broadcastPlayers() {
  io.emit("players:update", publicPlayers());
}

io.on("connection", (socket) => {
  socket.on("player:join", (payload = {}) => {
    const name = cleanText(payload.name, "Player", 24);
    const tankIndex = clampInt(payload.tankIndex, 0, 100, 0);
    const old = players.get(socket.id) || {};
    players.set(socket.id, {
      id: socket.id,
      name,
      tankIndex,
      x: finite(old.x, 100),
      y: finite(old.y, 100),
      angle: 0,
      lives: 100,
      joinedAt: Date.now()
    });
    socket.emit("players:update", publicPlayers());
    broadcastPlayers();
  });

  socket.on("player:move", (payload = {}) => {
    const current = players.get(socket.id);
    if (!current) return; // must join before sending movement
    current.x = clamp(finite(payload.x, current.x), -100000, 100000);
    current.y = clamp(finite(payload.y, current.y), -100000, 100000);
    current.angle = clamp(finite(payload.angle, 0), -Math.PI * 100, Math.PI * 100);
    current.lives = clampInt(payload.lives, 0, 100000, current.lives);
    current.tankIndex = clampInt(payload.tankIndex, 0, 100, current.tankIndex);
    current.name = cleanText(payload.name, current.name, 24);
    // Broadcast movement to everyone except sender to reduce traffic.
    socket.broadcast.emit("players:update", publicPlayers());
  });

  socket.on("disconnect", () => {
    if (players.delete(socket.id)) {
      io.emit("player:left", socket.id);
      broadcastPlayers();
    }
  });
});

function finite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function clampInt(value, min, max, fallback) {
  return Math.round(clamp(finite(value, fallback), min, max));
}
function cleanText(value, fallback, maxLength) {
  if (typeof value !== "string") return fallback;
  const text = value.replace(/[<>]/g, "").trim().slice(0, maxLength);
  return text || fallback;
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bomber Tanks server listening on port ${PORT}`);
});
