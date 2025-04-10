import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitContactForm } from "../services/api"; // Import the new API function
import "../styles/contact.css";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { branchId } = useParams(); // Get branch ID from URL params
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Form validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      // Use the branch ID from URL params
      const contactData = {
        name,
        email,
        subject,
        message,
        branchId,
      };

      // Call the API function to submit the contact form
      const response = await submitContactForm(contactData);

      if (response.success) {
        setSuccess(
          "Your message has been sent successfully. We'll get back to you soon."
        );
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(response.message || "Failed to send message");
      }
    } catch (err) {
      setError("An error occurred while sending your message");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have questions or feedback? Reach out to our team.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this regarding?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              rows="5"
              required
            />
          </div>

          <button type="submit" className="contact-button" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
