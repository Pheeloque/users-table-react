import { ROWS_PER_PAGE } from "../constants";

function Pagination({ page, total, onPageChange }) {
  const totalPages = Math.ceil(total / ROWS_PER_PAGE);

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Назад
      </button>
      <span style={{ margin: "0 10px" }}>
        Страница {page} из {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Вперёд
      </button>
    </div>
  );
}

export default Pagination;
