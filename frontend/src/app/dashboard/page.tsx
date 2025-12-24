import Link from "next/link";
import { Building2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link href="/dashboard/real-estate" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-100 group">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Real Estate</h2>
        </div>
        <p className="text-gray-500">Manage your properties, track values using different currencies.</p>
      </Link>
    </div>
  );
}