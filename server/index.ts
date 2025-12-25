import express from "express";
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

/* Health check */
app.get("/", (_req, res) => {
  res.send("API running");
});

/* Get all tasks */
app.get("/tasks", (_req, res) => {
  res.json(tasks);
});

/* Create task */
app.post("/tasks", (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const task: Task = {
    id: Date.now(),
    title,
    dueDate
  };

  tasks.push(task);
  res.status(201).json(task);
});

/* Delete task */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
