import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import taskRoutes from "./routes/task.routes";
import songRoutes from "./routes/song.routes";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "track4taskDB",
    });
    console.log(">> MongoDB connected successfully...");
  } catch (err) {
    console.error(
      ">> There is connection error in MongoDB\n>> Error details:",
      err
    );
  }
})();

app.use("/api/tasks", taskRoutes);
app.use("/api/songs", songRoutes);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`>> Server running on port http://192.168.1.4:${PORT}`)
);
