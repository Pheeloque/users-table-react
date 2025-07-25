import { COLUMNS } from "../constants";

function TableHeader({ sortField, sortDirection, onSortChange, filters, onFilterChange }) {
  return (
    <tr>
      {COLUMNS.map(({ key, label, sortable }) => (
        <th
          key={key}
          style={{ cursor: sortable ? "pointer" : "default", userSelect: "none", verticalAlign: "top" }}
          onClick={() => sortable && onSortChange(key)}
        >
          <div>
            {label}
            {sortField === key ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
          </div>
          {sortable && (
            <input
              type="text"
              value={filters[key] || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onFilterChange(key, e.target.value)}
              placeholder="Фильтр..."
              style={{ marginTop: 4, width: "90%" }}
            />
          )}
        </th>
      ))}
    </tr>
  );
}

export default TableHeader;
