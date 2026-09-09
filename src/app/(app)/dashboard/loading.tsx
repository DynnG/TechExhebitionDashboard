import { Skeleton } from "@/components/shared/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 font-manrope">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* Mid Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
