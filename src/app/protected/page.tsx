import Header from "@/app/components/header";
import { getAuthUser } from "@/utils/get-auth-user";
import { redirect } from "next/navigation";
import Categories from "./protected";

export default async function ProtectedPage() {
  const user = await getAuthUser();
  // console.log("In protected page",user)
  if (user) {
    if (!user.verified) {
      redirect("/verify");
    }
  }
  return (
    <>
      <Header />
      <section className="grid min-h-screen place-items-start py-10">
        <div className="w-full">
          <Categories />
        </div>
      </section>
    </>
  );
}
