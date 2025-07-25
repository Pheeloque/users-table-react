import { useState, useMemo } from "react";
import useUsers from "./hooks/useUsers";
import Pagination from "./components/Pagination";
import { ROWS_PER_PAGE } from "./constants";
import Table from "./components/Table";
import UserModal from "./components/UserModal";

export default function App() {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // Загрузка всех пользователей для фильтра
  const { users, total, loading, error } = useUsers({ sortField, sortDirection });

  function handleRowClick(user) {
    setSelectedUser(user);
  }

  function closeModal() {
    setSelectedUser(null);
  }

  // Фильтруем по всем колонкам
  const filteredUsers = useMemo(() => {
    const getValue = (obj, path) => path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);

    return users.filter((user) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const val = getValue(user, key);
        return val && val.toString().toLowerCase().startsWith(value.toLowerCase());
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

  if (error) {
    return (
      <div className="app-wrapper">
        <div className="error">Ошибка при загрузке данных: {error}</div>
      </div>
    );
  }

  // console.log("Users middlename:", users.map((u) => u.maidenName));

  return (
    <div className="app-wrapper">
      <h1>Пользователи</h1>

      <div className="table-wrapper">
        {error && <div className="error">{error}</div>}

        <Table
          users={pagedUsers}
          sortField={sortField}
          sortDirection={sortDirection}
          filters={filters}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          onRowClick={handleRowClick}
        />

        <UserModal user={selectedUser} onClose={closeModal} />

        {loading && (
          <div className="overlay">
            <div className="spinner" />
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={filteredUsers.length}
        onPageChange={(newPage) => {
          if (newPage >= 1 && newPage <= Math.ceil(total / ROWS_PER_PAGE)) {
            setPage(newPage);
          }
        }}
      />
    </div>
  );
}
