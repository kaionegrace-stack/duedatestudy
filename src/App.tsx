import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
};

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

const API = import.meta.env.PROD ? "" : "http://localhost:3001";

export default function App() {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!user) return;

    fetch(`${API}/api/tasks/${user.id}`)
      .then(res => res.json())
      .then(setTasks);
  }, [user]);

  async function login(endpoint: "login" | "register") {
    const res = await fetch(`${API}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
  }

  async function addTask() {
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        dueDate,
        userId: user!.id
      })
    });

    const task = await res.json();
    setTasks([...tasks, task]);
    setTitle("");
    setDueDate("");
  }

  async function deleteTask(id: number) {
    await fetch(`${API}/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t.id !== id));
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>🔐 Login / Register</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={() => login("login")}>Login</button>
        <button onClick={() => login("register")}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>📚 Due Date Study App</h1>
      <p>Logged in as {user.email}</p>
      <button onClick={logout}>Logout</button>

      <hr />

      <input
        placeholder="Task"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} — {t.dueDate}
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
