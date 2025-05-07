import { redirect } from "next/navigation";
import { getSession } from "@/lib";
import NewUserForm from "./auth/newUser";
import Login from "./auth/login";
import Intro from "./home/page";
export default async function Page() {

  const session = await getSession();
  console.log(session);
  if (!session) {
    return (
      <section className="logins">
        <Login />

        {/* Use client component for registration */}
        <NewUserForm />
      </section>
    );
  } else {
    return (
      <Intro />
    );
  }
}
