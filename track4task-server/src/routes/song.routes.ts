import express from "express";
import multer from "multer";
import path from "path";
import Song from "../models/Song";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.single("song"),
  async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const fileUrl = `http://192.168.1.4:5000/uploads/${req.file.filename}`;

      const newSong = new Song({
        name: req.file.originalname,
        fileUrl,
      });

      const savedSong = await newSong.save();
      console.log(">> Song uploaded:", savedSong);
      res.status(201).json(savedSong);
    } catch (error) {
      console.error(">> Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const songs = await Song.find().sort({ uploadedAt: -1 });
    res.json(songs);
  } catch (error) {
    console.error(">> Fetch songs error:", error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete song" });
  }
});

export default router;
