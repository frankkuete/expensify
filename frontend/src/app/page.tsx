"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, BarChart2, Building2, Shield } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Link from 'next/link';

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
    <div className="flex-1">
      {/* Hero Section */}
      <section className="flex items-center justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container flex items-center justify-center px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Gérez vos actifs en toute simplicité
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Expensify vous aide à suivre et gérer tous vos actifs immobiliers, financiers et plus encore.
            </p>
            <div className="space-x-4">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                >
                  Commencez gratuitement
                </Link>

                {/* "Se connecter" -> redirige vers sign-in */}
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50"
                >
                  Se connecter
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex items-center justify-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building2 className="h-10 w-10" />}
              title="Gestion Immobilière"
              description="Suivez vos biens immobiliers, leurs documents et leur valeur en temps réel."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10" />}
              title="Suivi des Investissements"
              description="Visualisez l'évolution de vos investissements et optimisez votre portefeuille."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Sécurité Maximale"
              description="Vos données sont cryptées et sécurisées selon les plus hauts standards."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex items-center justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold">
              Prêt à mieux gérer vos actifs ?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Rejoignez des milliers d&apos;utilisateurs qui font confiance à Expensify pour la gestion de leurs actifs.
            </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              >
                Créer un compte gratuit
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Composant FeatureCard
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};