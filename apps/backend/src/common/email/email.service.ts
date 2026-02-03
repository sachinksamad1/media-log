import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure transporter.
    // In production, use environment variables.
    // In development, we can use Ethereal or just log.
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to JSON transport for logging if no SMTP configured
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      // eslint-disable-next-line no-console
      console.log(
        'EmailService: SMTP not configured, using JSON transport (logging to console).',
      );
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const info = await this.transporter.sendMail({
      from:
        process.env.EMAIL_FROM || '"MediaLog Support" <noreply@medialog.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    if (process.env.SMTP_HOST) {
      // eslint-disable-next-line no-console
      console.log('Message sent: %s', info.messageId);
    } else {
      // eslint-disable-next-line no-console
      console.log('------------------------------------------');
      // eslint-disable-next-line no-console
      console.log('MOCK EMAIL SENT:');
      // eslint-disable-next-line no-console
      console.log('To:', to);
      // eslint-disable-next-line no-console
      console.log('Subject:', subject);
      // eslint-disable-next-line no-console
      console.log('Content:', text);
      // eslint-disable-next-line no-console
      console.log('------------------------------------------');
    }
  }

  async sendUsernameRecovery(to: string, username: string): Promise<void> {
    const subject = 'Recover Username - MediaLog';
    const text = `Hello,\n\nYou requested to recover your username.\n\nYour username is: ${username}\n\nIf you did not request this, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Username Recovery</h2>
        <p>Hello,</p>
        <p>You requested to recover your username.</p>
        <p>Your username is: <strong>${username}</strong></p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;
    await this.sendEmail(to, subject, text, html);
  }
}

export const emailService = new EmailService();
