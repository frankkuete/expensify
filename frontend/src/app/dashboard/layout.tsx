import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content */}
            <div className="drawer-content flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="flex justify-between items-center p-4 bg-white shadow-sm h-16 border-b shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost lg:hidden">
                            <Menu className="h-6 w-6" />
                        </label>
                        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">User: {userId?.slice(0, 15)}...</span>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-20">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="h-full">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
