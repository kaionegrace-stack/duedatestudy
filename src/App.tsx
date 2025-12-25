import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title || !dueDate) return;
    setTasks([...tasks, { id: Date.now(), title, dueDate }]);
    setTitle("");
    setDueDate("");
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate);
  };

  const saveEdit = () => {
    setTasks(tasks.map(t =>
      t.id === editingId ? { ...t, title, dueDate } : t
    ));
    setEditingId(null);
    setTitle("");
    setDueDate("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📘 DueDate Study</h1>

        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Assignment"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            style={styles.input}
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={editingId ? saveEdit : addTask}
          >
            {editingId ? "Save" : "Add"}
          </button>
        </div>

        {tasks.map(task => (
          <div key={task.id} style={styles.task}>
            <div onClick={() => startEdit(task)} style={{ cursor: "pointer" }}>
              <strong>{task.title}</strong>
              <div style={{ opacity: 0.7 }}>{task.dueDate}</div>
            </div>
            <button style={styles.delete} onClick={() => deleteTask(task.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#fff",
    maxWidth: "480px",
    width: "100%",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "1.5rem"
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem"
  },
  input: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  button: {
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer"
  },
  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    borderRadius: "8px",
    background: "#f9fafb",
    marginBottom: "0.5rem"
  },
  delete: {
    background: "transparent",
    border: "none",
    cursor: "pointer"
  }
};
