import { useState, useEffect } from "react";

export default function useUsers({ sortField, sortDirection }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех пользователей
  // Поскольку масштабы позволяют, это сделано
  // для удобной работы фильтров с клиентской части.
  // DummyJSON позволяет фильтровать только по одному
  // параметру и учитывает только точные совпадения
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: 1000 });
        if (sortField) params.append("sortBy", sortField);
        if (sortDirection) params.append("order", sortDirection);

        const res = await fetch(`https://dummyjson.com/users?${params.toString()}`);
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total ?? data.users.length);
      } catch (err) {
        setError(err.message);
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [sortField, sortDirection]);

  return { users, total, loading, error };
}
