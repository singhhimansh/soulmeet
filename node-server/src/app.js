import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import { initRoutes } from "./routes/loader.cjs";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Initialize routes dynamically
initRoutes(app);

app.get('/', (req, res) => {
  res.send("Hello World!");
})

// error handler middleware
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.send("Something went wrong!");
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
