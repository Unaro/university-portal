// src/app/practices/loading.tsx
import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent } from "@/shared/ui/card";

export default function PracticesLoading() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Заголовок */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ФИЛЬТРЫ */}
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="p-4 border-muted bg-muted/50">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/6" />
                  </div>
               </div>
            </Card>
          </div>

          {/* СПИСОК ВАКАНСИЙ (Skeletons) */}
          <div className="lg:col-span-3 space-y-4">
             <Skeleton className="h-5 w-40 mb-4" />
             {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="border-muted">
                   <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                         <div className="space-y-3 flex-1">
                            <Skeleton className="h-7 w-3/4" />
                            <div className="flex gap-2">
                               <Skeleton className="h-4 w-32" />
                               <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex gap-2 pt-2">
                               <Skeleton className="h-6 w-20 rounded-full" />
                               <Skeleton className="h-6 w-24 rounded-full" />
                               <Skeleton className="h-6 w-32 rounded-full" />
                            </div>
                         </div>
                         <Skeleton className="h-10 w-24 hidden md:block" />
                      </div>
                   </CardContent>
                </Card>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
