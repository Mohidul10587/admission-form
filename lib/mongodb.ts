import mongoose from "mongoose";
import Admin from "./models/Admin";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function createAdmin() {
  try {
    const email = "admin@gmail.com";
    const password = "admin123";
    const role = "admin";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return;
    }

    const admin = new Admin({ email, password, role });
    await admin.save();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB");
    // 👇 Only create admin after successful connection
    await createAdmin();

    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
