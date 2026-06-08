import { Resend } from 'resend';
import type { ContactFormPayload } from '@/types';
import { formatClientName } from '@/lib/name-utils';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getResendConfig() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;

  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY. Add it to your production environment.');
  }

  if (!resendFromEmail) {
    throw new Error('Missing RESEND_FROM_EMAIL. Add it to your production environment.');
  }

  if (!contactToEmail) {
    throw new Error('Missing CONTACT_TO_EMAIL. Add an admin recipient to your production environment.');
  }

  return {
    resendApiKey,
    resendFromEmail,
    contactToEmail,
  };
}

function formatAdminHtml(payload: ContactFormPayload) {
  const fullName = escapeHtml(formatClientName(`${payload.firstName.trim()} ${payload.lastName.trim()}`));
  const email = escapeHtml(payload.email.trim());
  const phone = payload.phone ? escapeHtml(payload.phone.trim()) : undefined;
  const company = payload.company ? escapeHtml(payload.company.trim()) : undefined;
  const service = escapeHtml(payload.service.trim());
  const message = escapeHtml(payload.message.trim()).replace(/\n/g, '<br/>');
  const website = payload.website ? escapeHtml(payload.website.trim()) : undefined;

  return `
    <div style="font-family:system-ui, sans-serif; line-height:1.6; color:#111;">
      <h1>New contact request received</h1>
      <p>A new contact form submission has been saved to Supabase.</p>
      <h2>Submission details</h2>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${email}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Message:</strong> ${message}</li>
        ${website ? `<li><strong>Website:</strong> ${website}</li>` : ''}
      </ul>
      <p style="margin-top:1rem;">View submissions in the admin dashboard to follow up.</p>
    </div>
  `;
}

function formatUserHtml(payload: ContactFormPayload) {
  const firstName = escapeHtml(payload.firstName.trim());
  const email = escapeHtml(payload.email.trim());
  const company = payload.company ? escapeHtml(payload.company.trim()) : undefined;
  const service = escapeHtml(payload.service.trim());

  return `
    <div style="font-family:system-ui, sans-serif; line-height:1.6; color:#111;">
      <h1>Thanks for reaching out, ${firstName}!</h1>
      <p>We received your message and will review it shortly.</p>
      <p><strong>Your request:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${service}</li>
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
      </ul>
      <p>One of our team members will contact you soon at <strong>${email}</strong>.</p>
      <p>Have a great day!</p>
    </div>
  `;
}

export async function sendContactNotificationEmails(payload: ContactFormPayload) {
  const config = getResendConfig();
  const resend = new Resend(config.resendApiKey);
  const adminRecipients = config.contactToEmail.split(',').map((email) => email.trim()).filter(Boolean);

  if (adminRecipients.length === 0) {
    throw new Error('No valid admin email recipients configured for CONTACT_TO_EMAIL.');
  }

  const sendRequests = [
    resend.emails.send({
      from: config.resendFromEmail,
      to: adminRecipients,
      subject: `New contact request from ${escapeHtml(formatClientName(`${payload.firstName.trim()} ${payload.lastName.trim()}`))}`,
      html: formatAdminHtml(payload),
    }),
    resend.emails.send({
      from: config.resendFromEmail,
      to: payload.email.trim(),
      subject: `Thanks for contacting ApeX Studio`,
      html: formatUserHtml(payload),
    }),
  ];

  const responses = await Promise.all(sendRequests);
  return responses;
}
