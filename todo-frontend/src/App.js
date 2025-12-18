import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Pagination from "./components/Pagination";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/todos?page=${page}&limit=5`
        );
        const data = await res.json();

        setTodos(data.todos || []);
        setTotalPages(
          data.totalPages || Math.ceil((data.total || 0) / 5)
        );
      } catch (err) {
        console.error("Failed to fetch todos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setTodos((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Add todo failed", err);
    }
  };

  const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });

    // Refetch current page
    const res = await fetch(
      `http://localhost:5000/api/todos?page=${page}&limit=5`
    );
    const data = await res.json();
    setTodos(data.todos || []);
    setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 5));
  } catch (err) {
    console.error("Delete failed", err);
  }
};


  // IMPORTANT: name kept as onNextStatus for compatibility
  const handleNextStatus = async (todo) => {
    const nextStatus =
      todo.status === "Pending"
        ? "In-Progress"
        : todo.status === "In-Progress"
        ? "Completed"
        : "Pending";

    try {
      const res = await fetch(
        `http://localhost:5000/api/todos/${todo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? data : t))
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Todo App</h1>

      <TodoForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onSubmit={handleSubmit}
      />

      {loading ? (
  <div className="d-flex justify-content-center mt-3">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
) : (
  <TodoList
    todos={todos}
    onDelete={handleDelete}
    onNextStatus={handleNextStatus}
  />
  
)}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() =>
          setPage((p) => Math.min(p + 1, totalPages))
        }
      />
    </div>
  );
}

export default App;
