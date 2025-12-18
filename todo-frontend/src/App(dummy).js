import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  // fetch todos on page load
  useEffect(() => {
    // const fetchTodos = async () => {
    //   try {
    //     const res = await fetch("http://localhost:5000/api/todos");
    //     const data = await res.json();
    //     setTodos(data.todos || data); // support pagination format
    //   } catch (error) {
    //     console.error("Error fetching todos:", error);
    //   }
    // };
const fetchTodos = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://localhost:5000/api/todos?page=${page}&limit=5`
    );
    const data = await res.json();

    setTodos(data.todos);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching todos:", error);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setTodos((prev) => [data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error:", error);
    }
  };
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this todo?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};
const handleStatusToggle = async (todo) => {
  const nextStatus =
    todo.status === "Pending"
      ? "In-Progress"
      : todo.status === "In-Progress"
      ? "Completed"
      : "Pending";

  try {
    const res = await fetch(`http://localhost:5000/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? data : t))
    );
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Add Todo
        </button>
      </form>

      <h2 style={{ marginTop: "20px" }}>Todo List</h2>
      {loading && <p>Loading...</p>}
      <ul>
      

  {todos.map((todo) => (
    <li key={todo.id}>
      {todo.title} - {todo.description} ({todo.status}){" "}
      <button onClick={() => handleStatusToggle(todo)}>
        Next Status
      </button>{" "}
      <button onClick={() => handleDelete(todo.id)}>
        Delete
      </button>
    </li>
  ))}
</ul>


<div style={{ marginTop: "10px" }}>
  <button
    onClick={() => setPage((p) => Math.max(p - 1, 1))}
    disabled={page === 1}
  >
    Previous
  </button>

  <span style={{ margin: "0 10px" }}>
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
    disabled={page === totalPages}
  >
    Next
  </button>
</div>
    </div>
  );
}

export default App;
