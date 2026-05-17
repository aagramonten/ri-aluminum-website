/**
 * RI Aluminum — Email Handler (Vercel Serverless Function)
 * Replaces send_email.php — uses Resend instead of PHP mail()
 *
 * Setup:
 *   1. npm install resend  (already in package.json)
 *   2. Add RESEND_API_KEY to Vercel Environment Variables
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT_EMAIL = 'info@richardsonindustrialpr.com';
const RECIPIENT_NAME  = 'Richardson Industrial PR';
const SITE_NAME       = 'Richardson Industrial PR';
const PHONE           = '+1 (939) 349-1440';

const PRODUCT_LABELS = {
  entry:            'Puerta de Entrada (Aluminio/Cristal)',
  closet_mirror:    'Puerta de Closet (Con Espejo)',
  closet_no_mirror: 'Puerta de Closet (Sin Espejo)',
  window:           'Ventanas y Cristales Fijos',
  railing:          'Barandales (Cristal/Aluminio)',
  other:            'Otro / No especificado',
};

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/<[^>]*>/g, '').slice(0, 1000);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const body = req.body || {};

  // Honeypot spam check
  if (body.website) {
    return res.status(200).json({ success: true }); // Fool bots
  }

  const name             = clean(body.name);
  const email            = clean(body.email);
  const phone            = clean(body.phone);
  const product_interest = clean(body.product_interest);
  const message          = clean(body.message);
  const preferred_date   = clean(body.preferred_date);
  const preferred_time   = clean(body.preferred_time);

  // Validation
  if (!name) return res.status(400).json({ success: false, message: 'El nombre es requerido.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'El correo no es válido.' });
  }

  const productLabel = PRODUCT_LABELS[product_interest] || product_interest || 'No especificado';

  const row = (label, value) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ebe3;">
        <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a6f3a;">${label}</span><br>
        <strong style="font-size:15px;color:#151210;">${value}</strong>
      </td>
    </tr>`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f1eb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1eb;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr>
    <td style="background:#151210;padding:28px 36px;">
      <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c8a97a;">Nueva Solicitud</p>
      <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:400;">${SITE_NAME}</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:36px;">
      <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
        Ha recibido una nueva solicitud de estimado a través del sitio web.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${row('Nombre', name)}
        ${row('Correo Electrónico', `<a href="mailto:${email}" style="color:#151210;text-decoration:none;">${email}</a>`)}
        ${row('Teléfono', phone || 'No especificado')}
        ${row('Producto de Interés', productLabel)}
        ${preferred_date ? row('Fecha Preferida', preferred_date) : ''}
        ${preferred_time ? row('Horario Preferido', preferred_time) : ''}
        <tr>
          <td style="padding:12px 0;">
            <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a6f3a;">Mensaje / Medidas</span><br>
            <p style="margin:8px 0 0;font-size:14px;color:#3a3530;line-height:1.65;background:#f9f6f1;padding:14px;border-radius:4px;border-left:3px solid #9a6f3a;">
              ${message ? message.replace(/\n/g, '<br>') : '<em style="color:#999;">Sin mensaje adicional.</em>'}
            </p>
          </td>
        </tr>
      </table>
      <div style="margin-top:28px;text-align:center;">
        <a href="mailto:${email}" style="display:inline-block;background:#9a6f3a;color:#ffffff;padding:12px 28px;border-radius:5px;font-size:13px;font-weight:600;letter-spacing:1px;text-decoration:none;text-transform:uppercase;">
          Responder a ${name}
        </a>
      </div>
    </td>
  </tr>
  <tr>
    <td style="background:#0d0b09;padding:20px 36px;text-align:center;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);">
        ${SITE_NAME} &bull; ${PHONE} &bull; ${RECIPIENT_EMAIL}
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const confirmHtml = `
<html><body style="font-family:Arial,sans-serif;color:#333;">
<div style="max-width:520px;margin:0 auto;padding:30px;">
  <h2 style="color:#9a6f3a;">¡Gracias, ${name}!</h2>
  <p>Hemos recibido su solicitud de estimado. Le responderemos en menos de <strong>24 horas</strong>.</p>
  <p>Si necesita respuesta inmediata, llámenos o escríbanos por WhatsApp:</p>
  <p><strong>📞 ${PHONE}</strong></p>
  <p>— El equipo de Richardson Industrial PR</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="font-size:12px;color:#999;">Este es un correo automático. No responda a este mensaje.</p>
</div>
</body></html>`;

  try {
    // Send notification to business
    await resend.emails.send({
      from:    `${SITE_NAME} <noreply@richardsonindustrialpr.com>`,
      to:      [RECIPIENT_EMAIL],
      replyTo: email,
      subject: `Nueva Solicitud de Estimado — ${name}`,
      html:    htmlBody,
    });

    // Send confirmation to client
    await resend.emails.send({
      from:    `${SITE_NAME} <info@richardsonindustrialpr.com>`,
      to:      [email],
      subject: `Recibimos su solicitud — ${SITE_NAME}`,
      html:    confirmHtml,
    });

    return res.status(200).json({ success: true, message: 'Solicitud enviada exitosamente.' });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ success: false, message: 'No se pudo enviar el correo. Intente de nuevo.' });
  }
}
