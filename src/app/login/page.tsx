import Header from "@/app/components/header";
import LoginForm from "@/app/login/login-form";
import { getAuthUser } from "@/utils/get-auth-user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getAuthUser({ shouldRedirect: false });
  if (user) {
    if (user.verified === true) {
      redirect("/protected");
    } else {
      redirect("/verify");
    }
  }
  return (
    <>
      <Header />
      <section className="grid min-h-screen place-items-center py-10">
        <div className="w-full">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
