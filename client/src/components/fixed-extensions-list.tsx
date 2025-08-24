import { useFixedExtensions, useUpdateFixedExtension } from "@/lib/hooks";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, FolderOpen, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function FixedExtensionsList() {
  const { data, isLoading, isError, refetch } = useFixedExtensions();
  const updateMutation = useUpdateFixedExtension();

  // 데이터 타입을 미리 확인하고 안전한 변수로 할당
  const items = Array.isArray(data?.items) ? data.items : [];
  const updatedAt = data?.updatedAt ? new Date(data.updatedAt) : null;

  const handleToggle = (id: number, blocked: boolean) => {
    updateMutation.mutate({ id, blocked });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-700 mb-4">
            네트워크 연결을 확인하고 다시 시도해주세요.
          </p>
          <Button
            onClick={() => refetch()}
            className="px-4 py-2"
            data-testid="button-retry-fixed"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[400px] flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">고정 확장자</h2>
            <p className="text-sm text-gray-600 mt-1">
              자주 차단되는 확장자 목록
            </p>
          </div>
          {updatedAt && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              업데이트: {updatedAt.toLocaleString("ko-KR")}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-grow">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <label className="flex items-center cursor-pointer group">
                  <Checkbox
                    checked={item.blocked}
                    onCheckedChange={
                      (checked) => handleToggle(item.id, !!checked) // <-- 동일 로직
                    }
                    disabled={updateMutation.isPending} // 전체 비활성화 유지(원하면 id별로 제어 가능)
                    data-testid={`checkbox-fixed-${item.ext}`}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    .{item.ext}
                  </span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <div>
              <FolderOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">아직 등록된 고정 확장자가 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
