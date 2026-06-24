import nodemailer from 'nodemailer'
import { lookup } from 'dns/promises'

// Railway blocks IPv6 — resolve smtp.gmail.com to IPv4 before connecting,
// then pass the resolved address directly so tls.connect never does its own lookup.
async function resolveIPv4(hostname: string): Promise<string> {
  const result = await lookup(hostname, { family: 4 })
  return result.address
}

async function createTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP_USER ou SMTP_PASS manquant dans les variables d\'environnement')

  const ip = await resolveIPv4('smtp.gmail.com')

  return nodemailer.createTransport({
    host: ip,
    port: 465,
    secure: true,
    tls: {
      // Keep SNI so Gmail's TLS certificate is validated against the correct hostname
      servername: 'smtp.gmail.com',
    },
    auth: { user, pass },
  })
}

// Échappe les caractères HTML — le prénom vient du formulaire patient
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Envoie une notification légère à la réception d'un nouveau formulaire.
 * Ne contient AUCUNE donnée médicale — uniquement prénom + initiale du nom.
 */
export async function sendNewFormNotification(
  patientPrenom: string,
  patientNom: string,
): Promise<void> {
  const user = process.env.SMTP_USER
  const recipient = process.env.SMTP_RECIPIENT ?? user
  if (!recipient) throw new Error('Destinataire email non configuré')

  const adminUrl = `${process.env.BASE_URL ?? 'https://formulaire.honaecare.com'}/admin`
  const prenomSafe = escapeHtml(patientPrenom.slice(0, 60))
  const initial = escapeHtml(patientNom.charAt(0).toUpperCase())
  const transporter = await createTransporter()

  const info = await transporter.sendMail({
    from: `"Honae Care" <${user}>`,
    to: recipient,
    subject: `Nouveau formulaire — ${patientPrenom.slice(0, 60).replace(/[\r\n]/g, ' ')} ${patientNom.charAt(0).toUpperCase()}.`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <body style="margin:0;padding:0;background:#FAF8F2;font-family:sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <div style="background:#5B1820;padding:24px 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;color:#E2AE00;text-transform:uppercase;font-weight:700;">Maison de fertilité</p>
            <h1 style="margin:4px 0 0;font-size:22px;color:#fff;font-weight:300;">Honae Care</h1>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 8px;font-size:14px;color:#666;">Nouveau formulaire d'anamnèse reçu</p>
            <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#5B1820;">${prenomSafe} ${initial}.</p>
            <a href="${adminUrl}"
               style="display:inline-block;background:#5B1820;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;">
              Accéder à l'administration
            </a>
          </div>
          <div style="padding:16px 32px;background:#FAF8F2;border-top:1px solid #F6D6D5;">
            <p style="margin:0;font-size:11px;color:#aaa;">
              Ce message ne contient aucune donnée médicale.<br>
              Les données sont chiffrées (AES-256) sur serveur européen.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[email] ✓ Envoyé à ${recipient} — messageId: ${info.messageId}`)
  }
}
