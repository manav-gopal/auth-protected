import {
  type VerifyUserInput,
  type CreateUserInput,
  type LoginUserInput,
} from "@/lib/user-schema";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { otpService } from "@/utils/otpServices";

export const registerHandler = async ({
  input,
}: {
  input: CreateUserInput;
}) => {
  try {
    // Here we store the new signed in user in our database.....
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
      },
    });

    //then sended the userData in response back except its password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, email, verified } = user;

    // set cookies
    const token = setCookies(user.id, user.email);

    return {
      status: "success",
      data: {
        user: { name, email, verified },
        token,
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    throw err;
  }
};

export const verifyHandler = async ({ input }: { input: VerifyUserInput }) => {
  try {
    //then sended the userData in response back except its password
    const isValidOTP = await otpService.validateOTP(input.email, input.otp);

    if (!isValidOTP) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid or expired OTP",
      });
    }

    // Update the user to set verified to true
    const user = await prisma.user.update({
      where: { email: input.email },
      data: { verified: true },
    });

    const { name, email, verified } = user;

    return {
      status: "success",
      data: {
        user: { name, email, verified },
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "OTP already exists",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};

export const loginHandler = async ({ input }: { input: LoginUserInput }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email or password",
      });
    }

    const token = setCookies(user.id, user.email);

    return {
      status: "success",
      token,
    };
  } catch (err: any) {
    throw err;
  }
};

export const logoutHandler = async () => {
  try {
    cookies().set("token", "", {
      maxAge: -1,
    });
    return { status: "success" };
  } catch (err: any) {
    throw err;
  }
};

function setCookies(id: string, email: string) {
  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ email: email, sub: id }, secret, {
    expiresIn: 30 * 24 * 60 * 1000,
  });

  const cookieOptions = {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 30 * 24 * 60 * 1000,
  };
  cookies().set("token", token, cookieOptions);
  return token;
}
