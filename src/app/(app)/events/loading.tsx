import { Skeleton } from "@/components/shared/skeleton";

export default function EventsLoading() {
  return (
    <div className="space-y-6 font-manrope">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white p-4 rounded-xl border border-[#D8D2C8] shadow-xs flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 flex-1 min-w-[200px] rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[12px] border border-[#D8D2C8] shadow-xs space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <div className="space-y-2 pt-2 border-t border-[#D8D2C8]/50">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3.5 w-32 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
