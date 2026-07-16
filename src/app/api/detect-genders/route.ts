import { detectGenders } from "@/lib/ai/openai";

export async function POST(request: Request) {
  try {
    const { names } = await request.json();

    if (!Array.isArray(names) || names.length === 0) {
      return Response.json(
        { error: "names must be a non-empty array" },
        { status: 400 }
      );
    }

    const genders = await detectGenders(names);

    return Response.json({ genders });
  } catch (error) {
    console.error("Error detecting genders:", error);
    return Response.json(
      { error: "Failed to detect genders" },
      { status: 500 }
    );
  }
}
