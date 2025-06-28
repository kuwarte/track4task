import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () =>
  console.log(`>> Server running on port http://localhost:${PORT}`)
);
