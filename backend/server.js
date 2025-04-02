const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/branches", require("./routes/branchRoutes"));
app.use("/api/handbooks", require("./routes/handbookRoutes"));
app.use("/api/parents", require("./routes/parentRoutes"));
app.use("/api/enrollment-forms", require("./routes/enrollmentFormRoutes"));
app.use("/api/job-applications", require("./routes/jobApplicationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/contact", require("./routes/contactRoutes")); // Add this line for the new contact routes

app.get("/api/connect", (req, res) => {
  res.json({
    message: "Connected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
