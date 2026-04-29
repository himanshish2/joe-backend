const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js"); // ✅ added

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Supabase config
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// store latest data
let latestData = null;

// ✅ POST route (FIXED)
app.post("/api/washroom/data", async (req, res) => {
  try {
    console.log("Incoming payload:", req.body);
    const payload = req.body;

    // ✅ INSERT into YOUR correct table
    const { data, error } = await supabase
      .from("frontend_readings") // 🔥 FIXED TABLE NAME
      .insert([payload])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    // ✅ store latest data
    latestData = data[0];

    // ✅ broadcast to frontend (real-time ready)
    io.emit("sensor-update", latestData);

    res.json({ success: true, data: latestData });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// GET latest data
app.get("/api/washroom/data", (req, res) => {
  res.json(latestData);
});

// socket connection
io.on("connection", (socket) => {
  console.log("Frontend connected");

  if (latestData) {
    socket.emit("sensor-update", latestData);
  }
});

server.listen(5000, () => console.log("Server running on 5000"));