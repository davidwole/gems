import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/tables.css";
import { API_URL } from "../services/api";

const ManageUsers = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`${API_URL}/users`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch users");
      }

      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/suspend`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update user status");
      }

      // Update the local state
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isSuspended: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to delete user");
      }

      // Remove user from local state
      setUsers(users.filter((user) => user._id !== userId));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="manage-users-container">
      <div className="table-header">
        <h2>Manage Users</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={user.isSuspended ? "suspended-row" : ""}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isSuspended ? "Suspended" : "Active"}</td>
                  <td className="actions-cell">
                    <button
                      className={
                        user.isSuspended ? "activate-button" : "suspend-button"
                      }
                      onClick={() =>
                        handleToggleSuspend(user._id, user.isSuspended)
                      }
                    >
                      {user.isSuspended ? "Activate" : "Suspend"}
                    </button>

                    {confirmDelete === user._id ? (
                      <>
                        <button
                          className="confirm-delete-button"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="delete-button"
                        onClick={() => setConfirmDelete(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
