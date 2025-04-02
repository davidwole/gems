const Contact = require("../models/Contact");
const Branch = require("../models/Branch");

// Create a new contact message
exports.createContact = async (req, res) => {
  const { name, email, subject, message, branchId } = req.body;

  try {
    // Validate branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      branch: branchId,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      msg: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while processing your request",
    });
  }
};

// Get all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate("branch", "name location");
    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get contacts by branch
exports.getContactsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const contacts = await Contact.find({ branch: branchId })
      .populate("branch", "name location")
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact message not found" });
    }

    // Validate status
    if (!["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    contact.status = status;
    await contact.save();

    res.json({
      success: true,
      msg: "Contact status updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a contact message
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact message not found" });
    }

    await Contact.findByIdAndDelete(id);

    res.json({
      success: true,
      msg: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
