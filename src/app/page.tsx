import Header from "@/app/components/header";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="bg-ct-dark-100 mx-auto flex h-[20rem] max-w-4xl items-center justify-center rounded-md">
          <p className="text-3xl font-semibold">Home Page</p>
        </div>
      </section>
    </>
  );
}
