require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth");
const { attachUser } = require("./middlewares/user");

const groupsRouter = require("./routes/groups");
const idolsRouter = require("./routes/idols");
const videosRouter = require("./routes/videos");
const playlistsRouter = require("./routes/playlists");
const adminVideosRouter = require("./routes/adminVideos"); 

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// public
app.use("/api/groups", groupsRouter);
app.use("/api/idols", idolsRouter);
app.use("/api/videos", videosRouter);

// protected
app.use("/api/playlists", verifyToken, attachUser, playlistsRouter);
app.use(
  "/api/admin/videos",
  verifyToken,
  attachUser,
  adminVideosRouter
);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
