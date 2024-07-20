import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { emailService } from "./emailServices";

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export const otpService = {
  generateOTP(): string {
    // Generate a 6-digit OTP
    return crypto.randomInt(10000000, 99999999).toString();
  },

  async saveOTP(email: string, otp: string): Promise<void> {
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME);

    const storedOTP = await prisma.otps.findUnique({
      where: { email },
    });
    if (storedOTP && storedOTP.expiresAt > new Date()) {
      // OTP is still valid
      return;
    }
    await prisma.otps.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt, user: { connect: { email } } },
    });
    await emailService.sendOTP(email, otp);
  },

  async validateOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = await prisma.otps.findUnique({
      where: { email },
    });

    if (!storedOTP) {
      return false;
    }

    if (storedOTP.otp !== otp) {
      return false;
    }

    if (storedOTP.expiresAt < new Date()) {
      // OTP has expired
      await prisma.otps.delete({ where: { email } });
      return false;
    }

    // OTP is valid, delete it to prevent reuse
    await prisma.otps.delete({ where: { email } });
    return true;
  },

  async deleteExpiredOTPs(): Promise<void> {
    await prisma.otps.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  },
};
