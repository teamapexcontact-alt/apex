import { NextResponse } from 'next/server';

const API_BASE = 'https://apexchatbot-admin.vercel.app/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }
    const response = await fetch(`${API_BASE}/faqs?projectId=${encodeURIComponent(projectId)}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[FAQs Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs.' }, { status: 502 });
  }
}
