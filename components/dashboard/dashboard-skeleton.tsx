import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-40 bg-bg-panel rounded-lg mb-2" />
          <div className="h-4 w-64 bg-bg-panel rounded-lg" />
        </div>
        <div className="h-8 w-28 bg-bg-panel rounded-lg" />
      </div>

      {/* Dashboard grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Priorities */}
        <div className="lg:col-span-2">
          <Card className="border-border-subtle bg-bg-panel">
            <CardHeader className="pb-4">
              <div className="h-5 w-36 bg-bg-elevated rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-bg-elevated border border-border-subtle"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-bg-panel mt-2" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-bg-panel rounded-lg mb-2" />
                      <div className="h-3 w-full bg-bg-panel rounded-lg mb-2" />
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-bg-panel rounded-md" />
                        <div className="h-5 w-20 bg-bg-panel rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Progress ring skeleton */}
          <Card className="border-border-subtle bg-bg-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-28 bg-bg-elevated rounded-lg mb-2" />
                  <div className="h-4 w-36 bg-bg-elevated rounded-lg" />
                </div>
                <div className="w-24 h-24 rounded-full bg-bg-elevated" />
              </div>
            </CardContent>
          </Card>

          {/* Meetings skeleton */}
          <Card className="border-border-subtle bg-bg-panel">
            <CardHeader className="pb-4">
              <div className="h-5 w-32 bg-bg-elevated rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-bg-elevated border border-border-subtle"
                >
                  <div className="h-4 w-2/3 bg-bg-panel rounded-lg mb-2" />
                  <div className="h-3 w-1/2 bg-bg-panel rounded-lg mb-3" />
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="w-6 h-6 rounded-full bg-bg-panel border-2 border-bg-elevated"
                        />
                      ))}
                    </div>
                    <div className="h-4 w-24 bg-bg-panel rounded-lg" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
