import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  // Si pas connecté → on redirige vers la page de login
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <p>Ton userId : {userId}</p>
    </div>
  )
}