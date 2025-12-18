function TodoList({ todos, onNextStatus, onDelete }) {
  return (
    <ul className="list-group">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{todo.title}</strong>
            <div className="text-muted small">{todo.description}</div>

            <span
              className={`badge mt-1 ${
                todo.status === "Completed"
                  ? "bg-success"
                  : "bg-warning text-dark"
              }`}
            >
              {todo.status}
            </span>
          </div>

          <div>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => onNextStatus(todo)}
            >
              Next Status
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
