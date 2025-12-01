const Handbook = require("../models/Handbook");

// Get handbook by branch and type
exports.getHandbook = async (req, res) => {
  const { branchId, type } = req.params;

  try {
    const handbook = await Handbook.findOne({ branch: branchId, type });

    if (!handbook) {
      return res.status(404).json({ msg: "Handbook not found" });
    }

    res.set({
      "Content-Type": handbook.contentType,
      "Content-Disposition": `inline; filename="${handbook.filename}"`,
    });

    return res.send(handbook.fileData);
  } catch (error) {
    console.error("Error fetching handbook:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Upload or update handbook
exports.uploadHandbook = async (req, res) => {
  const { branchId, type } = req.params;

  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  try {
    // Check if handbook already exists for this branch and type
    let handbook = await Handbook.findOne({ branch: branchId, type });

    if (handbook) {
      // Update existing handbook
      handbook.filename = req.file.originalname;
      handbook.fileData = req.file.buffer;
      handbook.contentType = req.file.mimetype;
      handbook.uploadedBy = req.user.id;
      handbook.updatedAt = Date.now();
    } else {
      // Create new handbook
      handbook = new Handbook({
        type,
        branch: branchId,
        filename: req.file.originalname,
        fileData: req.file.buffer,
        contentType: req.file.mimetype,
        uploadedBy: req.user.id,
      });
    }

    await handbook.save();
    res.status(201).json({
      msg: "Handbook uploaded successfully",
      filename: handbook.filename,
      updatedAt: handbook.updatedAt,
    });
  } catch (error) {
    console.error("Error uploading handbook:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete handbook
exports.deleteHandbook = async (req, res) => {
  const { branchId, type } = req.params;

  try {
    const handbook = await Handbook.findOne({ branch: branchId, type });

    if (!handbook) {
      return res.status(404).json({ msg: "Handbook not found" });
    }

    await Handbook.deleteOne({ branch: branchId, type });
    res.json({ msg: "Handbook deleted successfully" });
  } catch (error) {
    console.error("Error deleting handbook:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get handbook metadata (without the file data)
exports.getHandbookInfo = async (req, res) => {
  const { branchId, type } = req.params;

  try {
    const handbook = await Handbook.findOne({ branch: branchId, type })
      .select("-fileData")
      .populate("uploadedBy", "name");

    if (!handbook) {
      return res.status(404).json({ msg: "Handbook not found" });
    }

    res.json(handbook);
  } catch (error) {
    console.error("Error fetching handbook info:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
