import { redirect } from "next/navigation"

export default function Home() {
  // In a real implementation, you would check if the user is authenticated
  redirect("/login")
}
