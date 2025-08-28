import express from "express";
import Task, { ITask } from "../models/Task";

const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ done: 1, createdAt: -1 });
  console.log(`>> Task successfully fetched...\n>> Details: ${tasks}`);
  res.json(tasks);
});

router.post("/", async (req, res) => {
  try {
    const newTask: ITask = new Task(req.body);
    const savedTask = await newTask.save();
    console.log(">> Task successfully added...");
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(">> Task successfully updated...");
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log(">> Task successfully deleted...");
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;
