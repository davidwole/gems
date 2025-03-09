const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/branches", require("./routes/branchRoutes"));
app.use("/api/handbooks", require("./routes/handbookRoutes"));
app.use("/api/parents", require("./routes/parentRoutes"));
app.use("/api/enrollment-forms", require("./routes/enrollmentFormRoutes"));
app.use("/api/job-applications", require("./routes/jobApplicationRoutes"));

app.get("/api/connect", () => {
  res.json({
    message: "Connected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
