import { ROWS_PER_PAGE } from "../constants";

function Pagination({ page, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));

  const getPageNumbers = () => {
    const maxPagesToShow = 3;
    const pages = [];

    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination" style={{ marginTop: 20, display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Назад
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pageNumbers[0] > 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            fontWeight: p === page ? "bold" : "normal",
            textDecoration: p === page ? "underline" : "none",
          }}
        >
          {p}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Вперёд
      </button>
    </div>
  );
}

export default Pagination;
