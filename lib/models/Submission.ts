import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
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
      enum: ["পুরুষ", "মহিলা", "অন্যান্য"],
      required: true,
    },
    category: {
      type: String,
      enum: ["গান", "নৃত্য", "অভিনয়"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);
