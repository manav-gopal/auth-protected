import Header from "@/app/components/header";
import VerifyEmail from "./verify-form";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/utils/get-auth-user";
import { otpService } from "@/utils/otpServices";

export default async function VerifyPage() {
  let email = "email@gmail.com";
  const user = await getAuthUser({ shouldRedirect: false });
  if (user) {
    if (user.verified === false) {
      email = user.email;
      const otp = otpService.generateOTP();
      await otpService.saveOTP(email, otp);
    } else {
      redirect("/protected");
    }
  } else {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <section className="grid min-h-screen place-items-start py-10">
        <div className="w-full">
          <VerifyEmail email={email} />
        </div>
      </section>
    </>
  );
}
