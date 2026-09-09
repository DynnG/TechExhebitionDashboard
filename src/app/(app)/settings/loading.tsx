import { Skeleton } from "@/components/shared/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 font-manrope">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  );
}
