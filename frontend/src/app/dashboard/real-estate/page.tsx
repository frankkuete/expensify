import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import RealEstateManager from "@/components/features/real-estate/RealEstateManager";

export default async function RealEstatePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Real Estate Management</h1>
                <p className="text-gray-500">Manage your properties and track their value.</p>
            </header>

            <RealEstateManager />
        </div>
    );
}
