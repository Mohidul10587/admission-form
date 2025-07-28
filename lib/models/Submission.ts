import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema<Submission>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
      // You can validate the format with regex if needed
    },
    presentAddress: {
      type: String,
    },
    village: {
      type: String,
      required: true,
    },
    upazila: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);
