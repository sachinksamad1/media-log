import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
// import nodemailer from 'nodemailer';

const mocks = vi.hoisted(() => {
  const sendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
  const createTransport = vi.fn().mockReturnValue({
    sendMail,
  });
  return {
    sendMail,
    createTransport,
  };
});

// Destructure for easier usage in tests
const { sendMail: sendMailMock, createTransport: createTransportMock } = mocks;

vi.mock('nodemailer', () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

// Import the service
import { emailService } from '../../../../common/email/email.service.js';

describe('EmailService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Only clear sendMailMock, not createTransportMock
    // createTransportMock is called once during singleton initialization
    // and we want to preserve that call history for the initialization test
    sendMailMock.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should initialize transporter', () => {
    expect(createTransportMock).toHaveBeenCalled();
  });

  describe('sendEmail', () => {
    it('should send an email with correct parameters', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const text = 'Test content';
      const html = '<p>Test content</p>';

      await emailService.sendEmail(to, subject, text, html);

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to,
          subject,
          text,
          html,
        }),
      );
    });

    it('should fallback to text as html if html is not provided', async () => {
      const to = 'test@example.com';
      const subject = 'Test';
      const text = 'Content';

      await emailService.sendEmail(to, subject, text);

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          html: text,
        }),
      );
    });

    it('should use EMAIL_FROM env var if set', async () => {
      process.env.EMAIL_FROM = '"Custom Sender" <sender@example.com>';

      await emailService.sendEmail('to@example.com', 'Sub', 'Body');

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"Custom Sender" <sender@example.com>',
        }),
      );
    });

    it('should log mock email details when SMTP_HOST is not set (development mode)', async () => {
      delete process.env.SMTP_HOST;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await emailService.sendEmail('to@example.com', 'Sub', 'Body');

      expect(consoleSpy).toHaveBeenCalledWith('MOCK EMAIL SENT:');
      consoleSpy.mockRestore();
    });

    it('should log message ID when SMTP_HOST is set (production mode)', async () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await emailService.sendEmail('to@example.com', 'Sub', 'Body');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Message sent: %s',
        'test-message-id',
      );
      consoleSpy.mockRestore();
    });

    it('should throw if sending fails', async () => {
      const error = new Error('SMTP Error');
      sendMailMock.mockRejectedValueOnce(error);

      await expect(
        emailService.sendEmail('to@example.com', 'Sub', 'Body'),
      ).rejects.toThrow('SMTP Error');
    });
  });

  describe('sendUsernameRecovery', () => {
    it('should send username recovery email with correct content', async () => {
      const to = 'user@example.com';
      const username = 'myusername';

      await emailService.sendUsernameRecovery(to, username);

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to,
          subject: 'Recover Username - MediaLog',
          text: expect.stringContaining(username),
          html: expect.stringContaining(username),
        }),
      );
    });
  });
});
