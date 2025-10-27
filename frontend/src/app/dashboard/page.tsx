import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default async function DashboardPage() {
  const { userId } = await auth();
  // Si pas connecté → on redirige vers la page de login
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
      </header>
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur le Dashboard</h1>
      <p>Ton userId : {userId}</p>
    </div>
  )
}