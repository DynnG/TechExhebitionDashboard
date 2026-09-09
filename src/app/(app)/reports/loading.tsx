import { Skeleton } from "@/components/shared/skeleton";

export default function ReportsLoading() {
  return (
    <div className="space-y-6 font-manrope">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
      </div>

      {/* Report Configuration Card */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4 max-w-2xl">
        <Skeleton className="h-5 w-48 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Preview Container Skeleton */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        <Skeleton className="h-6 w-52 rounded" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
