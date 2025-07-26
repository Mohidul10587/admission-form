import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    default: "",
  },
  primaryColor: {
    type: String,
    default: "59 130 246", // blue-500
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)
