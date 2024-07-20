"use client";

import { LoadingButton } from "@/app/components/loading-button";
import { type VerifyUserInput, verifyUserSchema } from "@/lib/user-schema";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface VerifyEmailProps {
  email: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email }) => {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const methods = useForm<VerifyUserInput>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const otp = watch("otp");

  const handleChange = (index: number, value: string): void => {
    if (value.length <= 1) {
      const newOtp = (otp || "").padEnd(8, " ").split("");
      newOtp[index] = value;
      setValue("otp", newOtp.join("").trim(), { shouldValidate: true });

      if (value !== "" && index < 7) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      (!otp[index] || otp[index] === "")
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const { mutate: registerFn, isPending } = trpc.verifyUser.useMutation({
    onError(error) {
      setValue("otp", "");
      toast.error(error.message);
      console.log("Error message:", error.message);
    },
    onSuccess() {
      toast.success("verified successfully");
      router.push("/protected");
    },
  });

  const onSubmitHandler: SubmitHandler<VerifyUserInput> = (values) => {
    registerFn(values);
  };

  return (
    <div className="mx-auto max-w-xl rounded-[20px] border-[1px] border-[#C1C1C1] p-14 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Verify your email</h2>
      <p className="text-center text-base font-normal">
        Enter the 8 digit code you have received on
        <br />
      </p>
      <p className="mb-6 text-center text-base font-medium">{email}</p>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Code
        </label>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="mb-16 flex justify-between">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 rounded-md border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={otp ? (otp[index] ?? "") : ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                  />
                ))}
            </div>
            <LoadingButton loading={isPending}>VERIFY</LoadingButton>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default VerifyEmail;
