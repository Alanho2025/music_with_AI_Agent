require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyToken } = require("./src/middlewares/auth");
const { attachUser } = require("./src/middlewares/user");
const { requireAdmin } = require("./src/middlewares/roles");
const groupsRouter = require("./src/routes/groups");
const albumRoutes = require("./src/routes/albums");
const idolsRouter = require("./src/routes/idols");
const videosRouter = require("./src/routes/videos");
const playlistsRouter = require("./src/routes/playlists");
const adminVideosRouter = require("./src/routes/adminVideos"); 
const adminIdolsRouter = require("./src/routes/adminIdols");
const importRoutes = require("./src/routes/importRoutes");
const adminAlbumsRouter = require("./src/routes/adminAlbums");
const storeAlbumsRouter = require("./src/routes/storeAlbums");

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
app.use("/api/albums", albumRoutes);
app.use("/api/idols", idolsRouter);
app.use("/api/videos", videosRouter);

// protected
app.use("/api/playlists", verifyToken, attachUser, playlistsRouter);
app.use(
  "/api/admin/videos",
  verifyToken,
  attachUser,
  requireAdmin,
  adminVideosRouter
);
app.use(
  "/api/admin/idols",
  verifyToken,
  attachUser,
  requireAdmin,
  adminIdolsRouter
);
app.use(
  "/api/admin/albums",
  verifyToken,
  attachUser,
  requireAdmin,
  adminAlbumsRouter
);
app.use("/api/import", importRoutes);
app.use("/api/store/albums", storeAlbumsRouter);
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
