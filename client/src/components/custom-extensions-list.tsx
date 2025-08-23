import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomExtensions, useAddCustomExtension, useDeleteCustomExtension } from '@/lib/hooks';
import { addCustomExtensionSchema, type AddCustomExtensionForm, normalizeExt } from '@/lib/validation';
import { ExtensionTag } from './extension-tag';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';

export function CustomExtensionsList() {
  const { data, isLoading, error, refetch, isError } = useCustomExtensions();
  const addMutation = useAddCustomExtension();
  const deleteMutation = useDeleteCustomExtension();

  const form = useForm<AddCustomExtensionForm>({
    resolver: zodResolver(addCustomExtensionSchema),
    defaultValues: {
      extension: '',
    },
  });

  const onSubmit = async (values: AddCustomExtensionForm) => {
    // Check for duplicates in custom extensions
    if (data?.items.includes(values.extension)) {
      form.setError('extension', {
        message: '이미 존재하는 확장자입니다.',
      });
      return;
    }

    try {
      await addMutation.mutateAsync({ ext: values.extension });
      form.reset();
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  const handleDelete = (extension: string) => {
    deleteMutation.mutate(extension);
  };

  const handleInputChange = (value: string) => {
    const normalized = normalizeExt(value);
    return normalized;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-10 w-full mb-6" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
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
            data-testid="button-retry-custom"
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
            <h2 className="text-lg font-medium text-gray-900">커스텀 확장자</h2>
            <p className="text-sm text-gray-600 mt-1">사용자 정의 차단 확장자</p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {data?.count || 0} / {data?.limit || 200}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6">
            <FormField
              control={form.control}
              name="extension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 확장자 추가</FormLabel>
                  <div className="flex gap-3">
                    <FormControl className="flex-1">
                      <Input
                        placeholder="예: pdf, docx, zip"
                        data-testid="input-extension"
                        {...field}
                        onChange={(e) => {
                          const normalized = handleInputChange(e.target.value);
                          field.onChange(normalized);
                        }}
                      />
                    </FormControl>
                    <Button 
                      type="submit" 
                      disabled={addMutation.isPending || !form.formState.isValid}
                      data-testid="button-add-extension"
                    >
                      {addMutation.isPending && (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      추가
                    </Button>
                  </div>
                  <FormDescription>
                    소문자, 숫자만 허용. 최대 20자
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">추가된 확장자</h3>
            {data && data.count > 0 && (
              <button 
                onClick={() => {
                  // Clear all would require implementing bulk delete
                  // For now, we'll show individual delete only
                }}
                className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200"
                data-testid="button-clear-all"
              >
                전체 삭제
              </button>
            )}
          </div>
          
          {data && data.items.length > 0 ? (
            <div className="flex flex-wrap gap-2" data-testid="custom-extensions-list">
              {data.items.map((extension) => (
                <ExtensionTag
                  key={extension}
                  extension={extension}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500" data-testid="empty-state">
              <FolderOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">아직 추가된 커스텀 확장자가 없습니다.</p>
              <p className="text-xs mt-1">위의 입력 필드를 사용해 확장자를 추가해보세요.</p>
            </div>
          )}
        </div>

        {data && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>사용량</span>
              <span data-testid="usage-count">{data.count}/{data.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(data.count / data.limit) * 100}%` }}
                data-testid="usage-progress"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
