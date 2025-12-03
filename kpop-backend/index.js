require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./src/middlewares/auth");
const { attachUser } = require("./src/middlewares/user");

const groupsRouter = require("./src/routes/groups");
const idolsRouter = require("./src/routes/idols");
const videosRouter = require("./src/routes/videos");
const playlistsRouter = require("./src/routes/playlists");
const adminVideosRouter = require("./src/routes/adminVideos"); 
const importRoutes = require("./src/routes/importRoutes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
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
app.use("/api/import", importRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
