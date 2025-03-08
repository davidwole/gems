import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBranches } from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateUser from "../components/CreateUser";
import CreateBranch from "../components/CreateBranch";
import EditBranch from "../components/EditBranch";
import ManageUsers from "../components/ManageUsers";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [showEditBranch, setShowEditBranch] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      if (user?.role === "L1" || user?.role === "L2") {
        const branchData = await getBranches(token);
        setBranches(branchData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserCreated = () => {
    // You could show a success message or refresh data if needed
    console.log("User created successfully");
  };

  const handleBranchCreated = async () => {
    // Refresh the branches list
    const branchData = await getBranches(token);
    setBranches(branchData || []);
  };

  const handleBranchUpdated = async () => {
    // Refresh the branches list
    const branchData = await getBranches(token);
    setBranches(branchData || []);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setShowEditBranch(true);
  };

  const handleManageBranch = (branchId) => {
    navigate(`/branch/${branchId}`);
  };

  const handleFillEmploymentApplication = () => {
    // Navigate to I9Form page with the user's branch ID
    navigate(`/applicant-registration/${user.branch}`);
  };

  const handleParentEnrollment = () => {
    // Navigate to I9Form page with the user's branch ID
    navigate(`/parent-registration/${user.branch}`);
  };

  const handleUploadID = () => {
    // This will be implemented later
    navigate(`/uploadid`);
  };

  const handleUploadDocuments = () => {
    // This will be implemented later
    navigate(`/uploaddocuments`);
  };

  const handleSignAcknowledgements = () => {
    // This will be implemented later
    navigate(`/handbook/${user.branch}/employee`);
  };

  const handleParentSignAcknowledgements = () => {
    console.log("hello");
    console.log(user.branch);
    // This will be implemented later
    navigate(`/parenthandbook/${user.branch}`);
  };

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="dashboard">
      {/* Modal overlays */}
      {showCreateUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateUser
              onClose={() => setShowCreateUser(false)}
              onSuccess={handleUserCreated}
            />
          </div>
        </div>
      )}

      {showCreateBranch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateBranch
              onClose={() => setShowCreateBranch(false)}
              onSuccess={handleBranchCreated}
            />
          </div>
        </div>
      )}

      {showEditBranch && selectedBranch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditBranch
              branch={selectedBranch}
              onClose={() => setShowEditBranch(false)}
              onSuccess={handleBranchUpdated}
            />
          </div>
        </div>
      )}

      {showManageUsers && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <ManageUsers onClose={() => setShowManageUsers(false)} />
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome, {user.name}</h2>
          <p>
            You are logged in as: <strong>{user.role}</strong>
          </p>
        </div>

        {(user.role === "L1" || user.role === "L2") && (
          <div className="branches-section">
            <h3>Branches</h3>
            {loading ? (
              <p>Loading branches...</p>
            ) : branches.length > 0 ? (
              <div className="branches-grid">
                {branches.map((branch) => (
                  <div key={branch._id} className="branch-card">
                    <h4>{branch.name}</h4>
                    <p className="branch-location">{branch.location}</p>
                    <div className="branch-actions">
                      {user.role === "L1" && (
                        <button
                          className="edit-button"
                          onClick={() => handleEditBranch(branch)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="manage-button"
                        onClick={() => handleManageBranch(branch._id)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No branches found.</p>
            )}
          </div>
        )}

        {/* Render different sections based on user role */}
        {renderRoleSpecificContent(user.role, {
          openCreateUser: () => setShowCreateUser(true),
          openCreateBranch: () => setShowCreateBranch(true),
          openManageUsers: () => setShowManageUsers(true),
          fillEmploymentApplication: handleFillEmploymentApplication,
          fillParentEnrollment: handleParentEnrollment,
          uploadID: handleUploadID,
          uploadDocuments: handleUploadDocuments,
          signAcknowledgements: handleSignAcknowledgements,
          parentSignAcknowledgements: handleParentSignAcknowledgements,
        })}
      </div>
    </div>
  );
};

const renderRoleSpecificContent = (role, actions) => {
  switch (role) {
    case "L1":
      return (
        <div className="admin-actions">
          <h3>Admin Actions</h3>
          <div className="action-buttons">
            <button className="action-button" onClick={actions.openCreateUser}>
              Create User
            </button>
            <button
              className="action-button"
              onClick={actions.openCreateBranch}
            >
              Create Branch
            </button>
            <button className="action-button" onClick={actions.openManageUsers}>
              Manage Users
            </button>
          </div>
        </div>
      );
    case "L2":
      return (
        <div className="data-admin-section">
          <h3>Data Administration</h3>
          <div className="action-buttons">
            <button className="action-button">Manage Reviews</button>
            <button className="action-button">Edit Handbooks</button>
          </div>
        </div>
      );
    case "L3":
      return (
        <div className="director-section">
          <h3>Branch Director Tools</h3>
          <div className="action-buttons">
            <button className="action-button">View Applicants</button>
            <button className="action-button">Track Hiring</button>
          </div>
        </div>
      );
    case "L6": // Applicant role
      return (
        <div className="general-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={actions.fillEmploymentApplication}
            >
              Fill Employment Application
            </button>
            <button className="action-button" onClick={actions.uploadID}>
              Upload ID
            </button>
            <button
              className="action-button"
              onClick={actions.signAcknowledgements}
            >
              Sign Acknowledgements
            </button>
          </div>
        </div>
      );
    case "L8": // Parent role
      return (
        <div className="general-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={actions.fillParentEnrollment}
            >
              Fill Enrollment Application
            </button>
            <button className="action-button" onClick={actions.uploadDocuments}>
              Upload Documents
            </button>
            <button
              className="action-button"
              onClick={actions.parentSignAcknowledgements}
            >
              Sign Acknowledgements
            </button>
          </div>
        </div>
      );

    // Add more role-specific content as needed
    default:
      return (
        <div className="general-section">
          <h3>Quick Actions</h3>
          <p>Select an option from the sidebar to get started.</p>
        </div>
      );
  }
};

export default Dashboard;
