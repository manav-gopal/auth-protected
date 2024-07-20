"use client";

import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { type CreateUserInput, createUserSchema } from "@/lib/user-schema";
import { trpc } from "@/utils/trpc";
import FormInput from "@/app/components/form-input";
import { LoadingButton } from "@/app/components/loading-button";

export default function RegisterForm() {
  const router = useRouter();
  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: registerFn, isPending } = trpc.registerUser.useMutation({
    onError(error) {
      reset({ password: "", passwordConfirm: "" });
      toast.error(error.message);
      console.log("Error message:", error.message);
    },
    onSuccess() {
      toast.success("registered successfully");
      router.push("/verify");
    },
  });

  const onSubmitHandler: SubmitHandler<CreateUserInput> = (values) => {
    const lowerCaseEmail = { ...values, email: values.email.toLowerCase() };
    registerFn(lowerCaseEmail);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="min-h-[600px] w-full max-w-xl rounded-[20px] border-[1px] border-[#C1C1C1] p-12">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create your account
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            <FormInput label="Name" name="name" />
            <FormInput label="Email" name="email" type="email" />
            <FormInput label="Password" name="password" type="password" />
            <FormInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
            />
            <LoadingButton loading={isPending}>CREATE ACCOUNT</LoadingButton>
          </form>
        </FormProvider>
        <p className="mt-6 text-center text-sm font-normal text-[#333333]">
          Have an Account?{" "}
          <a
            href="/login"
            className="text-primary px-1 font-bold tracking-widest hover:underline"
          >
            LOGIN
          </a>
        </p>
      </div>
    </div>
  );
}
