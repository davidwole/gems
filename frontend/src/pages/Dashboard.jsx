// Updated Dashboard.jsx - L8 Section with Form Status Checks
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  API_URL,
  getBranches,
  getEnrollmentFormsByUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import CreateUser from "../components/CreateUser";
import CreateBranch from "../components/CreateBranch";
import EditBranch from "../components/EditBranch";
import ManageUsers from "../components/ManageUsers";
import "../styles/dashboard.css";
import { checkUserHasReviewed } from "../services/api";

const Dashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentForms, setEnrollmentForms] = useState([]);
  const [review, setReview] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [isHandbookAvailable, setIsHandbookAvailable] = useState(false);

  // New state for tracking form completion status
  const [formStatuses, setFormStatuses] = useState({});
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [showEditBranch, setShowEditBranch] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);

  const fetchHandbook = async () => {
    try {
      setLoading(true);

      // Fetch the handbook PDF
      const response = await fetch(
        `${API_URL}/handbooks/${user.branch}/parent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setIsHandbookAvailable(false);
        return;
      }

      setIsHandbookAvailable(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a form exists for a given enrollment form ID
  const checkFormExists = async (formId, formType) => {
    try {
      const response = await fetch(`${API_URL}/${formType}/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data && data.length > 0;
      }
      return false;
    } catch (error) {
      console.error(`Error checking ${formType} form:`, error);
      return false;
    }
  };

  // Function to load all form statuses for enrollment forms
  const loadFormStatuses = async (enrollmentFormIds) => {
    setLoadingStatuses(true);
    const statuses = {};

    const formTypes = [
      "ies-forms",
      "safe-sleep",
      "infant-feeding-plans",
      "infant-affidavits",
    ];

    try {
      for (const formId of enrollmentFormIds) {
        statuses[formId] = {};

        // Check each form type for this enrollment form
        for (const formType of formTypes) {
          const exists = await checkFormExists(formId, formType);
          statuses[formId][formType] = exists;
        }
      }

      setFormStatuses(statuses);
    } catch (error) {
      console.error("Error loading form statuses:", error);
    } finally {
      setLoadingStatuses(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    if (!user) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      if (
        user?.role === "L1" ||
        user?.role === "L2" ||
        user?.role === "L3" ||
        user?.role === "L4"
      ) {
        const branchData = await getBranches(token);
        console.log(branchData);
        setBranches(branchData || []);
      }

      // Fetch enrollment forms for L8 users
      if (user?.role === "L8" || user?.role == "L7") {
        setLoadingForms(true);
        try {
          const forms = await getEnrollmentFormsByUser(token);
          const formsData = forms?.data || [];
          setEnrollmentForms(formsData);

          // Load form statuses after getting enrollment forms
          if (formsData.length > 0) {
            const formIds = formsData.map((form) => form._id);
            await loadFormStatuses(formIds);
          }
        } catch (error) {
          console.error("Error fetching enrollment forms:", error);
        }
        setLoadingForms(false);
      }

      const fetchUserReviews = async () => {
        try {
          const result = await checkUserHasReviewed(token, user.id);
          setReview(result[0]);
        } catch (error) {
          console.error("Failed to get user reviews:", error);
        }
      };

      fetchUserReviews();
      setLoading(false);
    };

    fetchData();

    fetchHandbook();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUserCreated = () => {
    console.log("User created successfully");
  };

  const handleBranchCreated = async () => {
    const branchData = await getBranches(token);
    setBranches(branchData || []);
  };

  const handleBranchUpdated = async () => {
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

  // L8 specific handlers
  const handleFillParentEnrollment = () => {
    navigate(`/parent-registration/${user.branch}`);
  };

  const handleUploadDocuments = (formId = null) => {
    if (formId) {
      navigate(`/uploaddocuments/${formId}`);
    } else {
      navigate(`/uploaddocuments`);
    }
  };

  const handleNavigate = (url) => {
    navigate(url);
  };

  const handleParentSignAcknowledgements = (formId = null) => {
    if (formId) {
      navigate(`/parenthandbook/${user.branch}?formId=${formId}`);
    } else {
      navigate(`/parenthandbook/${user.branch}`);
    }
  };

  const handleInfantFeedingPlan = (formId = null, forL7 = false) => {
    if (formId) {
      navigate(`/infantfeedingplan${forL7 ? "filled" : ""}/${formId}`);
    } else {
      navigate(`/infantfeedingplan/${user.branch}`);
    }
  };

  const handleSafeSleep = (formId, forL7 = false) => {
    if (formId) {
      navigate(`/safesleep${forL7 ? "filled" : ""}/${formId}`);
    } else {
      navigate(`/safesleep/${user.branch}`);
    }
  };

  const handleInfantAffidavit = (formId, forL7 = false) => {
    if (formId) {
      navigate(`/infantaffidavit${forL7 ? "filled" : ""}/${formId}`);
    } else {
      navigate(`/infantaffidavit/${user.branch}`);
    }
  };

  const handleIESForm = (formId, forL7 = false) => {
    if (formId) {
      navigate(`/iesform${forL7 ? "filled" : ""}/${formId}`);
    } else {
      navigate(`/iesform/${user.branch}`);
    }
  };

  // Helper function to get button status
  const getButtonStatus = (formId, formType) => {
    // Don't show loading on initial render
    if (!hasMounted || loadingStatuses) {
      return { disabled: false, text: null, className: "" };
    }

    const isCompleted = formStatuses[formId]?.[formType];

    if (isCompleted) {
      return { disabled: true, text: "Completed", className: "completed" };
    }

    return { disabled: false, text: null, className: "" };
  };

  // Helper function to calculate age and determine if child is infant
  const calculateAge = (birthdateString) => {
    const today = new Date();
    const birthdate = new Date(birthdateString);
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const isInfant = (dateOfBirth) => {
    return calculateAge(dateOfBirth) < 1;
  };

  // Other handlers remain the same...
  const handleFillEmploymentApplication = () => {
    navigate(`/applicant-registration/${user.branch}`);
  };

  const handleUploadID = () => {
    navigate(`/uploadid`);
  };

  const handleReviewChildData = () => {
    navigate(`/child-data`);
  };

  const handleSignAcknowledgements = () => {
    navigate(`/handbook/${user.branch}/employee`);
  };

  const handlePostReview = () => {
    navigate(`/post-review/${user.branch}`);
  };

  // Add this useEffect to set mounted state
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="dashboard">
      {/* Modal overlays remain the same... */}
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

        {/* Branches section for admin roles */}
        {(user.role === "L1" ||
          user.role === "L2" ||
          user.role === "L3" ||
          user.role === "L4") && (
          <div className="branches-section">
            <h3>Branches</h3>
            {loading ? (
              <p>Loading branches...</p>
            ) : branches.length > 0 ? (
              <div className="branches-grid">
                {branches
                  .filter((branch) =>
                    user.role === "L3" || user.role === "L4"
                      ? branch._id === user.branch
                      : true
                  )
                  .map((branch) => (
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

        {/* L8 Parent Role - Multiple Children Sections */}
        {user.role === "L8" && (
          <div className="parent-sections">
            {/* New Enrollment Button */}
            <div className="new-enrollment-section">
              <h3>Add New Child</h3>
              <div className="action-buttons">
                {loadingForms ? (
                  <button className="action-button disabled">Loading...</button>
                ) : (
                  <button
                    className="action-button"
                    onClick={handleFillParentEnrollment}
                  >
                    Fill New Enrollment Application
                  </button>
                )}
              </div>
            </div>

            {/* Existing Children Sections */}
            {enrollmentForms.length > 0 && (
              <div className="children-sections">
                {enrollmentForms.map((form, index) => {
                  const iesStatus = getButtonStatus(form._id, "ies-forms");
                  const safeSleepStatus = getButtonStatus(
                    form._id,
                    "safe-sleep"
                  );
                  const feedingPlanStatus = getButtonStatus(
                    form._id,
                    "infant-feeding-plans"
                  );
                  const affidavitStatus = getButtonStatus(
                    form._id,
                    "infant-affidavits"
                  );

                  return (
                    <div key={form._id} className="child-section">
                      <h3>{form.childName || `Child ${index + 1}`}</h3>
                      <p className="child-info">
                        Date of Birth: {form.dateOfBirth} | Age:{" "}
                        {calculateAge(form.dateOfBirth)} years old
                        {isInfant(form.dateOfBirth) && (
                          <span className="infant-badge"> (Infant)</span>
                        )}
                      </p>
                      <div className="action-buttons">
                        <button
                          className="action-button"
                          onClick={() => handleUploadDocuments(form._id)}
                        >
                          Upload Documents
                        </button>
                        {isHandbookAvailable && (
                          <button
                            className="action-button"
                            onClick={() =>
                              handleParentSignAcknowledgements(form._id)
                            }
                          >
                            Sign Acknowledgements
                          </button>
                        )}
                        <button
                          className={`action-button ${iesStatus.className}`}
                          onClick={() => handleIESForm(form._id)}
                          disabled={iesStatus.disabled}
                        >
                          {iesStatus.text || "IES Form"}
                          {iesStatus.text === "Completed" && " ✓"}
                        </button>

                        {/* Infant-specific buttons */}
                        {isInfant(form.dateOfBirth) && (
                          <>
                            <button
                              className={`action-button infant-button ${feedingPlanStatus.className}`}
                              onClick={() => handleInfantFeedingPlan(form._id)}
                              disabled={feedingPlanStatus.disabled}
                            >
                              {feedingPlanStatus.text || "Infant Feeding Plan"}
                              {feedingPlanStatus.text === "Completed" && " ✓"}
                            </button>
                            <button
                              className={`action-button infant-button ${safeSleepStatus.className}`}
                              onClick={() => handleSafeSleep(form._id)}
                              disabled={safeSleepStatus.disabled}
                            >
                              {safeSleepStatus.text ||
                                "Safe Sleep Practices Policy"}
                              {safeSleepStatus.text === "Completed" && " ✓"}
                            </button>
                            <button
                              className={`action-button infant-button ${affidavitStatus.className}`}
                              onClick={() => handleInfantAffidavit(form._id)}
                              disabled={affidavitStatus.disabled}
                            >
                              {affidavitStatus.text || "Infant Affidavit"}
                              {affidavitStatus.text === "Completed" && " ✓"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Show message if no forms exist */}
            {!loadingForms && enrollmentForms.length === 0 && (
              <div className="no-forms-message">
                <p>
                  No enrollment forms found. Click "Fill New Enrollment
                  Application" to get started.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Render other role-specific content */}
        {user.role !== "L8" &&
          renderRoleSpecificContent(
            user.role,
            {
              openCreateUser: () => setShowCreateUser(true),
              openCreateBranch: () => setShowCreateBranch(true),
              openManageUsers: () => setShowManageUsers(true),
              fillEmploymentApplication: handleFillEmploymentApplication,
              uploadID: handleUploadID,
              reviewChildData: handleReviewChildData,
              uploadDocuments: handleUploadDocuments,
              signAcknowledgements: handleSignAcknowledgements,
            },
            enrollmentForms,
            loadingForms,
            getButtonStatus,
            calculateAge,
            isInfant,
            handleNavigate
          )}
      </div>
    </div>
  );
};

// Keep the existing renderRoleSpecificContent function for other roles
const renderRoleSpecificContent = (
  role,
  actions,
  enrollmentForms,
  loadingForms,
  getButtonStatus,
  calculateAge,
  isInfant,
  handleNavigate
) => {
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
              Manage Admin Users
            </button>
            <button
              className="action-button"
              onClick={() =>
                (window.location.href =
                  "https://gator3139.hostgator.com:2096/webmaillogin.cgi")
              }
            >
              Email Service
            </button>
            <button className="action-button">Payroll Portal</button>
          </div>
        </div>
      );
    case "L2":
      return (
        <div className="data-admin-section">
          <h3>Data Administration</h3>
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() =>
                (window.location.href =
                  "https://gator3139.hostgator.com:2096/webmaillogin.cgi")
              }
            >
              Email Service
            </button>
            <button className="action-button">Payroll Portal</button>
          </div>
        </div>
      );
    case "L3":
    case "L4":
      return (
        <div className="data-admin-section">
          <h3>Branch Administration</h3>
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() =>
                (window.location.href =
                  "https://gator3139.hostgator.com:2096/webmaillogin.cgi")
              }
            >
              Email Service
            </button>
            <button className="action-button">Payroll Portal</button>
          </div>
        </div>
      );
    case "L5":
      return (
        <div className="director-section">
          <h3>Employee Tools</h3>
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() =>
                (window.location.href =
                  "https://gator3139.hostgator.com:2096/webmaillogin.cgi")
              }
            >
              Email Service
            </button>
            <button className="action-button">Payroll Portal</button>
          </div>
        </div>
      );
    case "L6":
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
    case "L7":
      return (
        <div className="general-section">
          <h3>Child/Children Data </h3>
          <div className="action-buttons">
            {/* <button className="action-button" onClick={actions.reviewChildData}>
              Review Child Data
            </button>
            <button className="action-button" onClick={actions.uploadDocuments}>
              Upload Documents
            </button> */}
          </div>

          {enrollmentForms.length > 0 && (
            <div className="children-sections">
              {enrollmentForms.map((form, index) => {
                const iesStatus = getButtonStatus(form._id, "ies-forms");
                const safeSleepStatus = getButtonStatus(form._id, "safe-sleep");
                const feedingPlanStatus = getButtonStatus(
                  form._id,
                  "infant-feeding-plans"
                );
                const affidavitStatus = getButtonStatus(
                  form._id,
                  "infant-affidavits"
                );

                return (
                  <div key={form._id} className="child-section">
                    <h3>{form.childName || `Child ${index + 1}`}</h3>
                    <p className="child-info">
                      Date of Birth: {form.dateOfBirth} | Age:{" "}
                      {calculateAge(form.dateOfBirth)} years old
                      {isInfant(form.dateOfBirth) && (
                        <span className="infant-badge"> (Infant)</span>
                      )}
                    </p>

                    <div className="action-buttons">
                      {iesStatus.disabled && (
                        <button
                          className={`action-button ${iesStatus.className}`}
                          onClick={() =>
                            handleNavigate(`/iesfilledview/${form._id}`)
                          }
                        >
                          IES Form
                        </button>
                      )}

                      {/* Infant-specific buttons */}
                      {isInfant(form.dateOfBirth) && (
                        <>
                          {feedingPlanStatus.disabled && (
                            <button
                              className={`action-button infant-button ${feedingPlanStatus.className}`}
                              onClick={() =>
                                handleNavigate(
                                  `/infant-feeding-plan-filled/${form._id}`
                                )
                              }
                            >
                              Infant Feeding Plan{" "}
                            </button>
                          )}
                          {safeSleepStatus.disabled && (
                            <button
                              className={`action-button infant-button ${safeSleepStatus.className}`}
                              onClick={() =>
                                handleNavigate(`/safesleepfilled/${form._id}`)
                              }
                            >
                              Safe Sleep Practices Policy{" "}
                            </button>
                          )}
                          {affidavitStatus.disabled && (
                            <button
                              className={`action-button infant-button ${affidavitStatus.className}`}
                              onClick={() =>
                                handleNavigate(
                                  `/infantaffidavitfilled/${form._id}`
                                )
                              }
                            >
                              Infant Affidavit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show message if no forms exist */}
          {!loadingForms && enrollmentForms.length === 0 && (
            <div className="no-forms-message">
              <p>No enrollment forms found.</p>
            </div>
          )}
        </div>
      );
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
