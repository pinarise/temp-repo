import { Skeleton } from "@/components/ui/skeleton";

export function GridCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-48 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-3 rounded" />
      </div>
    </div>
  );
}

export function ListCardSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-4/5 h-3 rounded" />
      </div>
    </div>
  );
}

export function ReadMoreCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full h-40 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-2/3 h-3 rounded" />
      </div>
    </div>
  );
}

export function ArticlesSectionSkeleton() {
  return (
    <section className="space-y-4">
      <Skeleton className="w-32 h-6 rounded" />
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GridCardSkeleton key={i} />
        ))}
      </div>
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReadMoreCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function MultiSectionSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <ArticlesSectionSkeleton key={i} />
      ))}
    </div>
  );
}
