import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db/database.js";
// import { initRoutes } from "./routes/loader.js";
import router from "./routes/index.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

// Root test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err?.message || "Something went wrong!");
});

const startServer = async () => {
  await connectDB();
  console.log("DB connected");

  // ✅ Load all your routes before starting server
  // await initRoutes(app);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
