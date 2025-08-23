import { useFixedExtensions, useUpdateFixedExtensions } from '@/lib/hooks';
import { Checkbox } from './ui/checkbox';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    '실행파일': 'bg-red-50 text-red-700',
    '스크립트': 'bg-yellow-50 text-yellow-700',
    '배치파일': 'bg-red-50 text-red-700',
    '명령파일': 'bg-red-50 text-red-700',
    '라이브러리': 'bg-blue-50 text-blue-700',
    'Java': 'bg-orange-50 text-orange-700',
    '웹스크립트': 'bg-purple-50 text-purple-700',
    'Python': 'bg-green-50 text-green-700',
    'Ruby': 'bg-red-50 text-red-700',
    '스크린세이버': 'bg-gray-50 text-gray-700',
    'VBScript': 'bg-blue-50 text-blue-700',
    '레지스트리': 'bg-yellow-50 text-yellow-700',
    'PowerShell': 'bg-blue-50 text-blue-700',
    '설치파일': 'bg-purple-50 text-purple-700',
  };
  return colorMap[category] || 'bg-gray-50 text-gray-700';
};

export function FixedExtensionsList() {
  const { data, isLoading, error, refetch, isError } = useFixedExtensions();
  const updateMutation = useUpdateFixedExtensions();

  const handleToggle = (extension: string, blocked: boolean) => {
    updateMutation.mutate({
      updates: [{ ext: extension, blocked }]
    });
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
          <h3 className="text-lg font-medium text-red-900 mb-2">데이터를 불러올 수 없습니다</h3>
          <p className="text-sm text-red-700 mb-4">네트워크 연결을 확인하고 다시 시도해주세요.</p>
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">고정 확장자</h2>
            <p className="text-sm text-gray-600 mt-1">자주 차단되는 확장자 목록</p>
          </div>
          {data && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              업데이트: {new Date(data.updatedAt).toLocaleString('ko-KR')}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {data?.items.map((item) => (
            <div key={item.ext} className="flex items-center justify-between py-2">
              <label className="flex items-center cursor-pointer group">
                <Checkbox
                  checked={item.blocked}
                  onCheckedChange={(checked) => handleToggle(item.ext, !!checked)}
                  disabled={updateMutation.isPending}
                  data-testid={`checkbox-fixed-${item.ext}`}
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  .{item.ext}
                </span>
              </label>
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>마지막 동기화: 방금 전</span>
          </div>
        </div>
      </div>
    </div>
  );
}
