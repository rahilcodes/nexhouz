import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API Key is not configured on the server. Please define OPENAI_API_KEY in your env." },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    if (!payload || !payload.messages) {
      return NextResponse.json(
        { error: "Invalid payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: payload.model || "gpt-4o-mini",
        messages: payload.messages,
        temperature: payload.temperature ?? 0.7,
        max_tokens: payload.max_tokens ?? 800
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `OpenAI API error: ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
