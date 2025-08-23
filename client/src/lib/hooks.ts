import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blocklistApi, type UpdateFixedExtensionRequest, type AddCustomExtensionRequest } from './api';
import { useToast } from '@/hooks/use-toast';

// Fixed extensions hooks
export function useFixedExtensions() {
  return useQuery({
    queryKey: ['/api/blocklist/fixed'],
    queryFn: () => blocklistApi.getFixed(),
  });
}

export function useUpdateFixedExtensions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateFixedExtensionRequest) => blocklistApi.updateFixed(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/blocklist/fixed'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['/api/blocklist/fixed']);

      // Optimistically update
      queryClient.setQueryData(['/api/blocklist/fixed'], (old: any) => {
        if (!old) return old;
        
        const updatedItems = old.items.map((item: any) => {
          const update = newData.updates.find(u => u.ext === item.ext);
          return update ? { ...item, blocked: update.blocked } : item;
        });

        return {
          ...old,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['/api/blocklist/fixed'], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "오류",
        description: "설정을 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    },
    onSuccess: () => {
      toast({
        title: "성공",
        description: "설정이 저장되었습니다.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blocklist/fixed'] });
    },
  });
}

// Custom extensions hooks
export function useCustomExtensions() {
  return useQuery({
    queryKey: ['/api/blocklist/custom'],
    queryFn: () => blocklistApi.getCustom(),
  });
}

export function useAddCustomExtension() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AddCustomExtensionRequest) => blocklistApi.addCustom(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['/api/blocklist/custom'] });
      
      const previousData = queryClient.getQueryData(['/api/blocklist/custom']);
      
      queryClient.setQueryData(['/api/blocklist/custom'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: [...old.items, newData.ext].sort(),
          count: old.count + 1,
        };
      });

      return { previousData };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['/api/blocklist/custom'], context.previousData);
      }
      const message = err.message || '확장자를 추가하는 중 오류가 발생했습니다.';
      toast({
        variant: "destructive",
        title: "오류",
        description: message,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "성공",
        description: `.${data.ext} 확장자가 추가되었습니다.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blocklist/custom'] });
    },
  });
}

export function useDeleteCustomExtension() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ext: string) => blocklistApi.deleteCustom(ext),
    onMutate: async (deletedExt) => {
      await queryClient.cancelQueries({ queryKey: ['/api/blocklist/custom'] });
      
      const previousData = queryClient.getQueryData(['/api/blocklist/custom']);
      
      queryClient.setQueryData(['/api/blocklist/custom'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((ext: string) => ext !== deletedExt),
          count: old.count - 1,
        };
      });

      return { previousData, deletedExt };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['/api/blocklist/custom'], context.previousData);
      }
      toast({
        variant: "destructive",
        title: "오류",
        description: "확장자를 삭제하는 중 오류가 발생했습니다.",
      });
    },
    onSuccess: (_, deletedExt) => {
      toast({
        title: "성공",
        description: `.${deletedExt} 확장자가 삭제되었습니다.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blocklist/custom'] });
    },
  });
}
