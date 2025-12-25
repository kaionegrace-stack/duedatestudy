import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");
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

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    acc[task.dueDate] = acc[task.dueDate] || [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📅 DueDate Study</h1>

        <div style={styles.toggle}>
          <button onClick={() => setView("list")}>List</button>
          <button onClick={() => setView("calendar")}>Calendar</button>
        </div>

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
          <button style={styles.button} onClick={addTask}>
            Add
          </button>
        </div>

        {view === "list" && (
          <div>
            {tasks.map(task => (
              <div key={task.id} style={styles.task}>
                <strong>{task.title}</strong>
                <span>{task.dueDate}</span>
              </div>
            ))}
          </div>
        )}

        {view === "calendar" && (
          <div style={styles.calendar}>
            {[...Array(daysInMonth)].map((_, i) => {
              const date = new Date(year, month, i + 1)
                .toISOString()
                .slice(0, 10);

              return (
                <div key={date} style={styles.day}>
                  <div style={styles.dayNum}>{i + 1}</div>
                  {tasksByDate[date]?.map(task => (
                    <div key={task.id} style={styles.calendarTask}>
                      {task.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
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
    maxWidth: "700px",
    width: "100%",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "1rem"
  },
  toggle: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
    marginBottom: "1rem"
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
    padding: "0.5rem",
    borderBottom: "1px solid #eee"
  },
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "0.5rem"
  },
  day: {
    minHeight: "90px",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "0.25rem"
  },
  dayNum: {
    fontSize: "0.75rem",
    opacity: 0.6
  },
  calendarTask: {
    fontSize: "0.75rem",
    background: "#e0e7ff",
    padding: "0.2rem",
    borderRadius: "4px",
    marginTop: "0.2rem"
  }
};
