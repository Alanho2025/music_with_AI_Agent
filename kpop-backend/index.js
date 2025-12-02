// index.js
const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth");
const { attachUser } = require("./middlewares/user");

const groupsRouter = require("./routes/groups");
const idolsRouter = require("./routes/idols");
const playlistsRouter = require("./routes/playlists");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// public routes
app.use("/api/groups", groupsRouter);
app.use("/api/idols", idolsRouter);

// protected routes (需要登入)
app.use("/api/playlists", verifyToken, attachUser, playlistsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
