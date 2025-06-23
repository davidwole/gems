import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BranchPage from "./pages/BranchPage";
import ApplicantRegistration from "./pages/forms/ApplicantRegistration"; // Import the new component
import "./styles/main.css";
import I9Form from "./pages/forms/I9Form";
import ParentRegistration from "./pages/forms/ParentRegistration";
import IESForm from "./pages/forms/IESForm";
import UploadID from "./pages/UploadID";
import EmployeeHandbookSign from "./pages/EmployeeHandbookSign";
import UploadDocuments from "./pages/UploadDocuments";
import ParentHandbookSign from "./pages/ParentHandbookSign";
import IESFormSigning from "./pages/forms/IESFormSigning";
import ApplicationViewForm from "./pages/forms/ApplicationViewForm";
import { connect } from "./services/api";
import IESFormUnfilled from "./pages/forms/IESFormUnfilled";
import Contact from "./pages/Contact";
import InfantFeedingPlan from "./pages/forms/InfantFeedingPlan";
import SafeSleep from "./pages/forms/SafeSleep";
import InfantAffidavit from "./pages/forms/InfantAffidavit";
import EnrollmentForm from "./pages/forms/EnrollmentForm";
import EnrollmentFormUnfilled from "./pages/forms/EnrollmentFormUnfilled";
import EnrollmentFormFilled from "./pages/forms/EnrollmentFormFilled";
import CreateReview from "./components/CreateReview";
import PostReview from "./pages/PostReview";
import InfantFeedingPlanFilled from "./pages/forms/InfantFeedingPlanFilled";
import SafeSleepFilled from "./pages/forms/SafeSleepFilled";
import InfantAffidavitFilled from "./pages/forms/InfantAffidavitFilled";
import Documents from "./pages/Documents";
import ReviewChildData from "./pages/ReviewChildData";

// Suspension Modal Component
const SuspensionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Suspended</h2>
        <p>
          Your account has been suspended. Please contact an administrator for
          assistance.
        </p>
        <div className="form-actions">
          <button onClick={onClose} className="submit-button">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected route component with suspension check
const ProtectedRoute = ({ children }) => {
  const { user, token, logout } = useContext(AuthContext);
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);

  // Check for token
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if user is suspended based on JWT payload
  useEffect(() => {
    if (user?.isSuspended) {
      setShowSuspensionModal(true);
    }
  }, [user]);

  // Handle closing the suspension modal
  const handleCloseSuspensionModal = () => {
    setShowSuspensionModal(false);
    logout();
  };

  if (user?.isSuspended) {
    return (
      <>
        {showSuspensionModal && (
          <SuspensionModal onClose={handleCloseSuspensionModal} />
        )}
        <div style={{ filter: "blur(5px)" }}>{children}</div>
      </>
    );
  }

  return children;
};

// Redirect to dashboard if logged in
const RedirectIfLoggedIn = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// App routes that use context
const AppContent = () => {
  useEffect(() => {
    connect();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branch/:id"
        element={
          <ProtectedRoute>
            <BranchPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/application/:id"
        element={
          <ProtectedRoute>
            <ApplicationViewForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/filled-form/:id"
        element={
          <ProtectedRoute>
            <EnrollmentFormFilled />
          </ProtectedRoute>
        }
      />

      <Route
        path="/handbook/:branchId/:employee"
        element={
          <ProtectedRoute>
            <EmployeeHandbookSign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parenthandbook/:branchId"
        element={
          <ProtectedRoute>
            <ParentHandbookSign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/infantfeedingplan/:branchId"
        element={
          <ProtectedRoute>
            <InfantFeedingPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/infant-feeding-plan-filled/:userId"
        element={
          <ProtectedRoute>
            <InfantFeedingPlanFilled />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-review/:branchId"
        element={
          <ProtectedRoute>
            <PostReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/safesleep/:branchId"
        element={
          <ProtectedRoute>
            <SafeSleep />
          </ProtectedRoute>
        }
      />

      <Route
        path="/safesleepfilled/:userId"
        element={
          <ProtectedRoute>
            <SafeSleepFilled />
          </ProtectedRoute>
        }
      />

      <Route
        path="/infantaffidavit/:branchId"
        element={
          <ProtectedRoute>
            <InfantAffidavit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/infantaffidavitfilled/:userId"
        element={
          <ProtectedRoute>
            <InfantAffidavitFilled />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents-submitted/:userId"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/iesfilled/:userId"
        element={
          <ProtectedRoute>
            <IESFormSigning />
          </ProtectedRoute>
        }
      />

      <Route
        path="/child-data"
        element={
          <ProtectedRoute>
            <ReviewChildData />
          </ProtectedRoute>
        }
      />

      {/* Add the new route for applicant registration */}
      <Route path="/apply/:branchId" element={<ApplicantRegistration />} />
      <Route path="/enroll/:branchId" element={<ParentRegistration />} />
      <Route path="/contact/:branchId" element={<Contact />} />
      <Route path="/applicant-registration/:branchId" element={<I9Form />} />
      <Route
        path="/parent-registration/:branchId"
        element={<EnrollmentForm />}
      />
      <Route path="/iesform/:branchId" element={<IESForm />} />
      <Route path="/viewform" element={<EnrollmentFormUnfilled />} />
      <Route path="/uploadid" element={<UploadID />} />
      <Route path="/uploaddocuments" element={<UploadDocuments />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
