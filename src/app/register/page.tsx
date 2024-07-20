import Header from "@/app/components/header";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  return (
    <>
      <Header />
      <section className="grid min-h-screen place-items-center py-10">
        <div className="w-full">
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
