import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const updatedSettings = await Settings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
