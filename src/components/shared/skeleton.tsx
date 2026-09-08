interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#D8D2C8]/40 rounded-lg ${className}`}
    />
  );
}
