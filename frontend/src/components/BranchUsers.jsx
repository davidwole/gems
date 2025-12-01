import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import "../styles/tables.css";
import { API_URL } from "../services/api";

const BranchUsers = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [branchUsers, setBranchUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const isL1User = user?.role === "L1";

  useEffect(() => {
    fetchBranchUsers();
  }, [id, token]);

  const fetchBranchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/branches/${id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch branch users");
      }

      setBranchUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId, currentStatus) => {
    if (!isL1User) {
      setError("Only L1 administrators can suspend or activate users");
      return;
    }

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
      setBranchUsers(
        branchUsers.map((user) =>
          user._id === userId ? { ...user, isSuspended: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!isL1User) {
      setError("Only L1 administrators can delete users");
      return;
    }

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
      setBranchUsers(branchUsers.filter((user) => user._id !== userId));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnrollUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/enroll`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBranchUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="loading">Loading branch users...</div>;
  }

  return (
    <div className="branch-users-section">
      <div className="section-header">
        <h2>Branch Users</h2>
        {/* {isL1User && <button className="action-button">Add New User</button>} */}
      </div>

      {error && <div className="error-message">{error}</div>}

      {branchUsers.length === 0 ? (
        <div className="content-placeholder">
          <p>No users found for this branch.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {isL1User && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {branchUsers.map((branchUser) => (
                <tr
                  key={branchUser._id}
                  className={branchUser.isSuspended ? "suspended-row" : ""}
                >
                  <td>{branchUser.name}</td>
                  <td>{branchUser.email}</td>
                  <td>{branchUser.role}</td>
                  <td>{branchUser.isSuspended ? "Suspended" : "Active"}</td>
                  {isL1User && (
                    <td className="actions-cell">
                      {branchUser.role === "L8" && (
                        <button
                          className="enroll-button"
                          onClick={() => handleEnrollUser(branchUser._id)}
                        >
                          Enroll
                        </button>
                      )}

                      <button
                        className={
                          branchUser.isSuspended
                            ? "activate-button"
                            : "suspend-button"
                        }
                        onClick={() =>
                          handleToggleSuspend(
                            branchUser._id,
                            branchUser.isSuspended
                          )
                        }
                      >
                        {branchUser.isSuspended ? "Activate" : "Suspend"}
                      </button>

                      {confirmDelete === branchUser._id ? (
                        <>
                          <button
                            className="confirm-delete-button"
                            onClick={() => handleDeleteUser(branchUser._id)}
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
                          onClick={() => setConfirmDelete(branchUser._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BranchUsers;
