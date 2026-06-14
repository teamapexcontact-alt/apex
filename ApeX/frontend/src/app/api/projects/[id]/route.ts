import { NextResponse } from 'next/server';

const API_BASE = 'https://apexchatbot-admin.vercel.app/api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(id)}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Projects Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project.' }, { status: 502 });
  }
}
