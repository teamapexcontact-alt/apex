import { NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/server/firebase-admin';
import { cookies } from 'next/headers';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatClientName } from '@/lib/name-utils';

export const dynamic = 'force-dynamic';

async function verifyAdminSession(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) return { authorized: false, error: 'No session' };

    const adminAuth = getAdminAuth();
    if (!adminAuth) return { authorized: false, error: 'Auth not configured' };

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const db = getDb();
    if (!db) return { authorized: false, error: 'DB not configured' };

    const snapshot = await db.collection('admin').where('user_id', '==', decoded.uid).limit(1).get();
    if (snapshot.empty) return { authorized: false, error: 'Not an admin' };

    return { authorized: true };
  } catch {
    return { authorized: false, error: 'Invalid session' };
  }
}

type PDFFontLike = { widthOfTextAtSize: (text: string, size: number) => number };

function wrapText(text: string, font: PDFFontLike, size: number, maxWidth: number) {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph === '') { lines.push(''); continue; }
    const words = paragraph.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await verifyAdminSession();
    if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });

    const docSnap = await db.collection('contact_requests').doc(id).get();
    if (!docSnap.exists) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    const data = docSnap.data()!;
    const name = formatClientName((data.name as string) || 'Unknown');
    const email = (data.email as string) || '';
    const phone = (data.phone as string) || 'Not provided';
    const company = (data.company as string) || 'Not provided';
    const message = (data.message as string) || '';
    const project = (data.project as string) || '';
    const createdAt = data.created_at ? new Date(String(data.created_at)).toLocaleString('en-US') : '';

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();

    page.drawRectangle({ x: 40, y: height - 96, width: width - 80, height: 56, color: rgb(0.06, 0.06, 0.06) });
    page.drawText('ApeX — PRECISION. PRESTIGE. PERFORMANCE.', { x: 56, y: height - 74, size: 12, font: helveticaBold, color: rgb(1, 1, 1) });

    let metaY = height - 110;
    page.drawText(`Submission: ${name}`, { x: 56, y: metaY, size: 11, font: helveticaBold, color: rgb(0,0,0) });
    metaY -= 18;
    page.drawText(`Email: ${email}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) });
    metaY -= 16;
    page.drawText(`Phone: ${phone}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) });
    metaY -= 16;
    page.drawText(`Company: ${company}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) });
    metaY -= 16;
    page.drawText(`Submitted: ${createdAt}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) });
    if (project) { metaY -= 16; page.drawText(`Project: ${project}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) }); }

    const bodyTop = metaY - 30;
    const maxWidth = width - 112;
    const fontSize = 11;
    const lines = wrapText(message || '(No message provided)', helvetica, fontSize, maxWidth);
    let cursorY = bodyTop;
    for (const line of lines) {
      if (cursorY < 72) break;
      page.drawText(line, { x: 56, y: cursorY, size: fontSize, font: helvetica, color: rgb(0,0,0) });
      cursorY -= fontSize + 4;
    }

    page.drawText('ApeX Digital Studio', { x: 56, y: 48, size: 10, font: helveticaBold, color: rgb(0.2,0.2,0.2) });

    const pdfBytes = await pdfDoc.save();
    const fileName = `apex-submission-${id}.pdf`;
    const buffer = Buffer.from(pdfBytes);
    const base64 = buffer.toString('base64');

    return NextResponse.json({ pdf: base64, filename: fileName }, { status: 200 });
  } catch (err: unknown) {
    console.error('Error generating PDF:', err);
    return NextResponse.json({ error: 'Failed to generate PDF document.' }, { status: 500 });
  }
}
