import { NextRequest, NextResponse } from "next/server";
import { generatePrayerDocx } from "@/lib/docx/generatePrayerDocx";
import { ParsedPrayer } from "@/lib/ai/parser";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const preview: ParsedPrayer[] = Array.isArray(requestBody.preview)
      ? requestBody.preview
      : [];

    const docxBuffer = await generatePrayerDocx(preview);
    const arrayBuffer = docxBuffer.buffer.slice(
      docxBuffer.byteOffset,
      docxBuffer.byteOffset + docxBuffer.byteLength
    ) as ArrayBuffer;
    const responseBody = new Uint8Array(arrayBuffer);

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="prayer-request.docx"',
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX file" },
      { status: 500 }
    );
  }
}
