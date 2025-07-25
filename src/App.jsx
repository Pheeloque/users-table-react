import { useState, useMemo } from "react";
import useUsers from "./hooks/useUsers";
import TableHeader from "./components/TableHeader";
import Pagination from "./components/Pagination";
import { COLUMNS, ROWS_PER_PAGE } from "./constants";

export default function App() {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [filters, setFilters] = useState({});

  // Загрузка всех пользователей для фильтра
  const { users, total, loading, error } = useUsers({ sortField, sortDirection });

  // Фильтруем по всем колонкам
  const filteredUsers = useMemo(() => {
    const getValue = (obj, path) => path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);

    return users.filter((user) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const val = getValue(user, key);
        return val && val.toString().toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [users, filters]);

  // Делим на страницы
  const pagedUsers = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredUsers.slice(start, start + ROWS_PER_PAGE);
  }, [filteredUsers, page]);

  function handleSortChange(field) {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection("asc");
    } else {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    }
    setPage(1);
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Пользователи</h1>

      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <TableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </thead>
        <tbody>
          {pagedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.maidenName}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.address.country}</td>
              <td>{user.address.city}</td>
            </tr>
          ))}
          {pagedUsers.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} style={{ textAlign: "center" }}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        total={total}
        onPageChange={(newPage) => {
          if (newPage >= 1 && newPage <= Math.ceil(total / ROWS_PER_PAGE)) {
            setPage(newPage);
          }
        }}
      />
    </div>
  );
}
