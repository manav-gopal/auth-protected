"use client";

import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type LoginUserInput, loginUserSchema } from "@/lib/user-schema";
import FormInput from "@/app/components/form-input";
import { LoadingButton } from "@/app/components/loading-button";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const { reset, handleSubmit } = methods;

  const { mutate: loginFn, isPending } = trpc.loginUser.useMutation({
    onError(error) {
      toast.error(error.message);
      console.log("Error message:", error.message);
      reset({ password: "" });
    },
    onSuccess() {
      toast.success("login successfully");
      router.push("/verify");
    },
  });

  const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
    loginFn(values);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full max-w-xl rounded-[20px] border-[1px] border-[#C1C1C1] px-12 py-8">
        <h2 className="mb-8 text-center text-3xl font-semibold">Login</h2>
        <h2 className="mb-3 text-nowrap text-center text-2xl font-medium">
          Welcome back to the ECOMMERCE
        </h2>
        <h2 className="mb-8 text-nowrap text-center text-base font-normal">
          The next gen business marketplace
        </h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            <FormInput label="Email" name="email" type="email" />
            <FormInput
              label="Password"
              name="password"
              type="password"
              show={true}
            />
            <LoadingButton loading={isPending}>LOGIN</LoadingButton>
          </form>
        </FormProvider>
        <div className="mt-6 block h-[1px] w-full bg-[rgba(193,193,193,0.5)]"></div>
        <p className="mt-6 pb-4 text-center text-sm font-normal text-[#333333]">
          {"Don't Have an Account? "}
          <a
            href="/register"
            className="text-primary px-1 font-bold tracking-widest hover:underline"
          >
            SIGN UP
          </a>
        </p>
      </div>
    </div>
  );
}
