const Branch = require("../models/Branch");

// Create Branch (L1 Superuser only)
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();

    res.json(branches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const branches = await Branch.findById(req.params.id);

    res.json(branches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Branch (L1 Superuser only)
exports.createBranch = async (req, res) => {
  const { name, location } = req.body;

  try {
    let branch = await Branch.findOne({ name });
    if (branch) return res.status(400).json({ msg: "Branch already exists" });

    branch = new Branch({ name, location, createdBy: req.user.id });
    await branch.save();

    res.status(201).json({ msg: "Branch created successfully", branch });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Edit Branch (L1 Superuser only)
exports.editBranch = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    let branch = await Branch.findById(id);
    if (!branch) return res.status(404).json({ msg: "Branch not found" });

    // Check if name is being changed and if that name already exists
    if (name && name !== branch.name) {
      const existingBranch = await Branch.findOne({ name });
      if (existingBranch) {
        return res
          .status(400)
          .json({ msg: "Branch with that name already exists" });
      }
    }

    branch.name = name || branch.name;
    branch.location = location || branch.location;
    branch.updatedBy = req.user.id;
    branch.updatedAt = Date.now();

    await branch.save();

    res.json({ msg: "Branch updated successfully", branch });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
