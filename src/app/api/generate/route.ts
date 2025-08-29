import { NextResponse } from "next/server";
import { generateThread } from "@/lib/generateThread";

export async function POST(req: Request) {
  const { topic, tone } = await req.json();

  if (!topic || !tone) {
    return NextResponse.json(
      {
        error: "Missing Input",
      },
      {
        status: 400,
      }
    );
  }
  
  try {
    const thread = await generateThread(topic, tone);
    return NextResponse.json({ thread });
  } catch (err) {
    console.error("Thread generation error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate thread",
      },
      {
        status: 500,
      }
    );
  }
}