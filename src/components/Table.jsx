import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { COLUMNS } from "../constants";

export default function Table({ users, sortField, sortDirection, filters, onSortChange, onFilterChange, onRowClick }) {
  return (
    <table>
      <thead>
        <TableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          filters={filters}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
        />
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => <TableRow key={user.id} user={user} onClick={onRowClick} />)
        ) : (
          <tr>
            <td colSpan={COLUMNS.length} style={{ textAlign: "center" }}>
              Нет данных
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
