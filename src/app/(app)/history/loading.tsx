import { Skeleton } from "@/components/shared/skeleton";

export default function HistoryLoading() {
  return (
    <div className="space-y-6 font-manrope">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#D8D2C8]/50">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-3 w-72 rounded" />
            </div>
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
