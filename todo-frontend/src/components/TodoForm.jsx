function TodoForm({ title, description, setTitle, setDescription, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="mb-2">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Description</label>
        <input
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className="btn btn-primary">Add Todo</button>
    </form>
  );
}

export default TodoForm;
