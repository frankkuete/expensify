"use client";

import { useAuth } from "@clerk/nextjs";

export default function Home() {

  const { getToken, userId } = useAuth();

  const fetchAssets = async () => {
    const token = await getToken(); // récupère le JWT Clerk peut ajouter { template: "default" }
    console.log("Token:", token);
    const res = await fetch("http://localhost:3001/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Expensify</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Expensify!</h2>
        <p className="text-gray-600">Track your expenses, income, and financial goals.</p>
        <button
          onClick={fetchAssets}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Get user</button>
      </main>
    </div>
  );
}