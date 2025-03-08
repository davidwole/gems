import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBranches } from "../services/api";
import "../styles/home.css";

const Home = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (user?.role === "L1" || user?.role === "L2") {
      getBranches(token).then(setBranches);
    }

    console.log(user);
    console.log(branches);
  }, [user, token]);

  return (
    <div className="home-container">
      {user ? (
        <>
          <h1>
            Welcome, {user.name} ({user.role})
          </h1>
          <button onClick={logout} className="logout-button">
            Logout
          </button>

          {user.role === "L1" || user.role === "L2" ? (
            <div className="branches-section">
              <h2>Branches</h2>
              {branches.length > 0 ? (
                <ul>
                  {branches.map((branch) => (
                    <li key={branch._id} className="branch-item">
                      {branch.name} - {branch.location}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No branches found.</p>
              )}
            </div>
          ) : (
            <p>No access to branches</p>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;
