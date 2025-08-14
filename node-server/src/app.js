import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db/database.js";
import router from "./routes/index.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

// health check
app.get("/", (req, res, next) => {
  res.send("Hello World!");
});


// routes
app.use("/", router);


// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err?.message || "Something went wrong!");
});

const startServer = async () => {
  await connectDB();
  console.log("DB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
