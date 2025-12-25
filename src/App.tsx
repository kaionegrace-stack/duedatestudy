import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

function App() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load saved tasks
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title || !dueDate) return;

    setTasks([
      ...tasks,
      { id: Date.now(), title, dueDate }
    ]);

    setTitle("");
    setDueDate("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <h1>📚 Due Date Study</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Assignment name"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.length === 0 && <p>No assignments yet</p>}

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.dueDate}
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
