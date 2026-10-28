
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    jobType: {
      type: String,
      default: "Full-time"
    },
    appliedDate: {
      type: Date,
      required: true
    },
    salary: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Interview",
        "Offer",
        "Rejected",
        "Accepted"
      ],
      default: "Applied"
    },
    statusHistory: {
      type: [
        {
          status: String,
          changedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: function () {
        return [{ status: this.status }];
      }
    },
    applicationId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);
