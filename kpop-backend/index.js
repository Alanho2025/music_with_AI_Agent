const express = require("express");
const cors = require("cors");

const groupRoutes = require("./routes/groups");
const idolRoutes = require("./routes/idols");

const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true}
));
app.use(express.json());

// routes
app.use("/api/groups", groupRoutes);
app.use("/api/idols", idolRoutes);

app.get("/", (req, res) => {
  res.send("K-pop API running");
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});