import { useState, useRef } from "react";
import { COLUMNS } from "../constants";

function TableHeader({ sortField, sortDirection, onSortChange, filters, onFilterChange }) {
  const [colWidths, setColWidths] = useState(() =>
    COLUMNS.reduce((acc, col) => {
      acc[col.key] = col.width || 150;
      return acc;
    }, {})
  );

  const startX = useRef(0);
  const resizingCol = useRef(null);
  const startWidthCurrent = useRef(0);
  const startWidthNext = useRef(0);

  function startResize(e, key) {
    e.preventDefault();
    startX.current = e.clientX;
    resizingCol.current = key;

    startWidthCurrent.current = colWidths[key];
    const currentIndex = COLUMNS.findIndex((c) => c.key === key);
    const nextKey = COLUMNS[currentIndex + 1]?.key;
    startWidthNext.current = nextKey ? colWidths[nextKey] : 0;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (!resizingCol.current) return;

    const deltaX = e.clientX - startX.current;
    const currentKey = resizingCol.current;
    const currentIndex = COLUMNS.findIndex((c) => c.key === currentKey);
    const nextKey = COLUMNS[currentIndex + 1]?.key;
    if (!nextKey) return;

    let newCurrentWidth = startWidthCurrent.current + deltaX;
    let newNextWidth = startWidthNext.current - deltaX;

    const minWidth = 50;
    if (newCurrentWidth < minWidth) {
      newCurrentWidth = minWidth;
      newNextWidth = startWidthCurrent.current + startWidthNext.current - minWidth;
    } else if (newNextWidth < minWidth) {
      newNextWidth = minWidth;
      newCurrentWidth = startWidthCurrent.current + startWidthNext.current - minWidth;
    }

    setColWidths((prev) => ({
      ...prev,
      [currentKey]: newCurrentWidth,
      [nextKey]: newNextWidth,
    }));
  }

  function onMouseUp() {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return (
    <tr>
      {COLUMNS.map(({ key, label, sortable }, index) => (
        <th
          key={key}
          style={{
            userSelect: "none",
            position: "relative",
            width: colWidths[key],
            minWidth: 50,
            verticalAlign: "top",
          }}
        >
          <span
            style={{
              cursor: sortable ? "pointer" : "default",
              display: "block",
              userSelect: "none",
              overflow: "hidden",
            }}
            onClick={() => sortable && onSortChange(key)}
          >
            {label}
            {sortField === key ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
          </span>
          {sortable && (
            <input
              type="text"
              value={filters[key] || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onFilterChange(key, e.target.value)}
              placeholder="Фильтр..."
              style={{
                marginTop: 4,
                maxWidth: "90%",
                boxSizing: "border-box",
                width: "90%",
              }}
            />
          )}
          {index < COLUMNS.length - 1 && <div className="resizer" onMouseDown={(e) => startResize(e, key)} />}
        </th>
      ))}
    </tr>
  );
}

export default TableHeader;
