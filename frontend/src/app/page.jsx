import { redirect } from "next/navigation";

// use content - user to check if user is logged in and redirect to home if they are
export default function Home() {
  redirect("/landing");
}
