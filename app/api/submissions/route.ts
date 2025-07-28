import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const submission = await Submission.create(body);
    return NextResponse.json(
      { success: true, id: submission._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission creation error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const verifiedParam = searchParams.get("verified");

    const filter: any = {};
    if (verifiedParam === "true") filter.paymentVerified = true;
    else if (verifiedParam === "false") filter.paymentVerified = false;

    const [submissions, total, verified, pending] = await Promise.all([
      Submission.find(filter)
        .select("imageUrl name phone transactionId paymentVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(),
      Submission.countDocuments({ paymentVerified: true }),
      Submission.countDocuments({ paymentVerified: false }),
    ]);

    return NextResponse.json(
      { submissions, total, verified, pending },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
