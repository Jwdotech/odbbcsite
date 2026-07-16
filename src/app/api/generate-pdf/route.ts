import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { generatePrayerBookletHtml } from "@/lib/pdf/generatePrayerBookletHtml";
import { ParsedPrayer } from "@/lib/ai/parser";

export async function POST(req: NextRequest) {
  let browser;

  try {
    const body = await req.json();
    const preview: ParsedPrayer[] = Array.isArray(body.preview)
      ? body.preview
      : [];

    const html = generatePrayerBookletHtml(preview);

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const pdfArrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    ) as ArrayBuffer;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="prayer-booklet.pdf"',
      },
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF." },
      { status: 500 }
    );
  }
}
