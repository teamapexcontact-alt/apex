import { NextResponse } from 'next/server';
import { protectAdminRoute } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/server/supabase-server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatClientName } from '@/lib/name-utils';

export const dynamic = 'force-dynamic';

type PDFFontLike = { widthOfTextAtSize: (text: string, size: number) => number };

function wrapText(text: string, font: PDFFontLike, size: number, maxWidth: number) {
  const paragraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(' ');
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(test, size);
      if (width > maxWidth) {
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
    const auth = await protectAdminRoute();
    if (!auth || !auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const client = supabaseAdmin;
    if (!client) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await client
      .from('contact_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const record = data as Record<string, unknown>;
    const name = formatClientName((record.name as string) || 'Unknown');
    const email = (record.email as string) || '';
    const phone = (record.phone as string) || 'Not provided';
    const company = (record.company as string) || 'Not provided';
    const message = (record.message as string) || '';
    const project = (record.project as string) || '';
    const createdAt = record.created_at ? new Date(String(record.created_at)).toLocaleString('en-US') : '';

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();

    // Header
    page.drawRectangle({ x: 40, y: height - 96, width: width - 80, height: 56, color: rgb(0.06, 0.06, 0.06) });
    page.drawText('ApeX — PRECISION. PRESTIGE. PERFORMANCE.', {
      x: 56,
      y: height - 74,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Subheader / meta
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

    // Project info if present
    if (project) {
      metaY -= 16;
      page.drawText(`Project: ${project}`, { x: 56, y: metaY, size: 10, font: helvetica, color: rgb(0,0,0) });
    }

    // Message body
    const bodyTop = metaY - 30;
    const maxWidth = width - 112;
    const fontSize = 11;
    const lines = wrapText(message || '(No message provided)', helvetica, fontSize, maxWidth);

    let cursorY = bodyTop;
    for (const line of lines) {
      if (cursorY < 72) break; // simple pagination guard
      page.drawText(line, { x: 56, y: cursorY, size: fontSize, font: helvetica, color: rgb(0,0,0) });
      cursorY -= fontSize + 4;
    }

    // Footer
    page.drawText('ApeX Digital Studio', { x: 56, y: 48, size: 10, font: helveticaBold, color: rgb(0.2,0.2,0.2) });

    const pdfBytes = await pdfDoc.save();

    const fileName = `apex-submission-${id}.pdf`;

    // Convert to base64 and return JSON to avoid runtime binary typing issues
    const buffer = Buffer.from(pdfBytes);
    const base64 = buffer.toString('base64');

    return NextResponse.json({ pdf: base64, filename: fileName }, { status: 200 });
  } catch (err: unknown) {
    console.error('Error generating PDF:', err);
    return NextResponse.json({ error: 'Failed to generate PDF document.' }, { status: 500 });
  }
}
