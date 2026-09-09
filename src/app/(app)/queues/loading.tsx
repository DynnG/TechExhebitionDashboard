import { Skeleton } from "@/components/shared/skeleton";

export default function QueuesLoading() {
  return (
    <div className="space-y-6 font-manrope">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-8 w-44 rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D8D2C8] gap-6 pb-2">
        <Skeleton className="h-8 w-56 rounded-md" />
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>

      {/* Queue items */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs flex items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
              <Skeleton className="h-5 w-72 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
