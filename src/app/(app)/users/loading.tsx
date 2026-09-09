import { Skeleton } from "@/components/shared/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6 font-manrope">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#D8D2C8]/50">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
