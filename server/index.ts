import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

let tasks: Task[] = [];

/* API routes */
app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const task = { id: Date.now(), title, dueDate };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

/* Serve frontend */
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
