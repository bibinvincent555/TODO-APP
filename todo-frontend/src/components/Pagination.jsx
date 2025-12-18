function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <button
        className="btn btn-outline-secondary me-2"
        disabled={page === 1}
        onClick={onPrev}
      >
        Previous
      </button>

      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="btn btn-outline-secondary ms-2"
        disabled={page === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
