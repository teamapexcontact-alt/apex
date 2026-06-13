import { NextResponse } from 'next/server';

const CHAT_API = 'https://apexchatbot-admin.vercel.app/api/chat';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Chat Proxy] Error:', error);
    return NextResponse.json({ error: 'Chat service unavailable.' }, { status: 502 });
  }
}
