
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Applications fetched successfully",
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a new application
router.post("/", async (req, res) => {
  try {
    const application = await Application.create({
      companyName: req.body.company,
      role: req.body.role,
      jobType: req.body.jobType,
      appliedDate: req.body.appliedDate,
      salary: req.body.salary || 0,
      notes: req.body.notes || "",
      status: "Applied"
    });

    res.status(201).json({
      success: true,
      message: "Application added successfully",
      data: application
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Edit an application
router.put("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        companyName: req.body.company,
        role: req.body.role,
        jobType: req.body.jobType,
        appliedDate: req.body.appliedDate,
        salary: req.body.salary ?? 0,
        notes: req.body.notes ?? ""
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully",
      data: application
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete an application
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
      data: application
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
