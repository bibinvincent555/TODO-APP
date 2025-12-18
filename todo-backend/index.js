
let todos = [];
const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Todo Backend is running");
});
app.post("/api/todos", (req, res) => {
  const { title, description } = req.body || {};

  // validation
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo = {
    id: Date.now(),
    title,
    description: description || "",
    status: "Pending",
    createdAt: new Date(),
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// app.get("/api/todos", (req, res) => {
//   res.status(200).json(todos);
// });

app.get("/api/todos", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedTodos = todos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(todos.length / limit);

  res.json({
    todos: paginatedTodos,
    page,
    limit,
    totalPages,
    total: todos.length,
  });
});



app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;

  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== Number(id));

  if (todos.length === initialLength) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json({ message: "Todo deleted successfully" });
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  const todo = todos.find(todo => todo.id === Number(id));

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (status !== undefined) todo.status = status;

  res.json(todo);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
