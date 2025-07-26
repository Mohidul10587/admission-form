import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "address",
      "phone",
      "transactionId",
      "gender",
      "category",
      "imageUrl",
      "paymentAmount",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const submission = new Submission(body);

    await submission.save();

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

    const [submissions, total, totalAmount] = await Promise.all([
      Submission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Submission.countDocuments(),
      Submission.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: "$paymentAmount" } } },
      ]),
    ]);

    const stats = {
      total,
      verified: await Submission.countDocuments({ paymentVerified: true }),
      pending: await Submission.countDocuments({ paymentVerified: false }),
    };
    const finalTotalAmount = total > 0 ? totalAmount[0]?.totalAmount || 0 : 0;
    return NextResponse.json(
      { submissions, stats, finalTotalAmount },
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
