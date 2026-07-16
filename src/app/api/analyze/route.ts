import { NextRequest, NextResponse } from "next/server";
import { fixGrammar } from "@/lib/ai/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requests: string[] = Array.isArray(body.requests)
      ? body.requests
      : [];

    const cleaned = await fixGrammar(requests);

    return NextResponse.json({ cleaned });
  } catch (error) {
    console.error("Grammar fix failed:", error);
    return NextResponse.json(
      { error: "Failed to fix grammar." },
      { status: 500 }
    );
  }
}
