import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* ---------- AUTH ---------- */
type User = {
  id: number;
  email: string;
  password: string;
};

let users: User[] = [];

/* Register */
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = { id: Date.now(), email, password };
  users.push(user);

  res.json({ id: user.id, email: user.email });
});

/* Login */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ id: user.id, email: user.email });
});

/* ---------- TASKS ---------- */
type Task = {
  id: number;
  title: string;
  dueDate: string;
  userId: number;
};

let tasks: Task[] = [];

app.get("/api/tasks/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  res.json(tasks.filter(t => t.userId === userId));
});

app.post("/api/tasks", (req, res) => {
  const { title, dueDate, userId } = req.body;

  if (!title || !dueDate || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const task = { id: Date.now(), title, dueDate, userId };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

/* ---------- FRONTEND ---------- */
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
