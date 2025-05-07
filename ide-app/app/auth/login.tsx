import { login } from "@/lib";
import { redirect } from "next/navigation";

export default function Login() {
    return(
        <form
            action={async (formData) => {
            "use server";
            await login(formData);
            redirect("/");
            }}
        >
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <br />
            <button type="submit">Login</button>
        </form>
    )     
}