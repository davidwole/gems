import { useState, useEffect } from "react";
import "../../styles/handbook.css";
import parentHandbookPDF from "../../assets/pdfs/parenthandbook.pdf";
import Signature from "../../components/Signature";

const ParentHandbook = () => {
  const [loading, setLoading] = useState(true);

  // You can use state to track loading of PDF if needed
  useEffect(() => {
    // Simulate loading time or actual PDF loading check
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="handbook-container">
      <header className="handbook-header">
        <h1>Parent Handbook</h1>
        <a href="/" className="back-button">
          Back to Dashboard
        </a>
      </header>

      <div className="handbook-content">
        {loading ? (
          <div className="loading-indicator">Loading handbook...</div>
        ) : (
          <div className="pdf-container">
            <iframe
              src={parentHandbookPDF}
              title="Parent Handbook"
              className="pdf-viewer"
            ></iframe>
          </div>
        )}
      </div>

      <form style={{ marginLeft: 500 }}>
        <Signature />
        <label>(signature)</label>
        <input type="date" />
        <label>(date)</label>
      </form>
    </div>
  );
};

export default ParentHandbook;
