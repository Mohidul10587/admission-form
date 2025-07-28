import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    logoUrl: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "59 130 246",
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    sendMonyNumbers: {
      type: [String],
      default: [],
    },
    rulesAndCommands: {
      type: [String],
      default: [],
    },
    whatsapp: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
