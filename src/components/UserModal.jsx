export default function UserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="modal-avatar" />
        <h2>
          {user.lastName} {user.firstName} {user.middleName}
        </h2>
        <p>Возраст: {user.age}</p>
        <p>Рост: {user.height} см</p>
        <p>Вес: {user.weight} кг</p>
        <p>Телефон: {user.phone}</p>
        <p>Email: {user.email}</p>
        <p>
          Адрес: {user.address?.address}, {user.address?.city}, {user.address?.state}, {user.address?.country}
        </p>

        <button className="modal-close-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
