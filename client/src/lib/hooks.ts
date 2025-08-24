import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

// --- 타입 정의 ---

// 고정 확장자 API 응답 타입
interface FixedExtensionItem {
  id: number;
  ext: string;
  blocked: boolean;
}

interface FixedExtensionsResponse {
  items: FixedExtensionItem[];
  updatedAt: string;
}

export interface CustomExtensionItem {
  id: number;
  ext: string;
}

// 커스텀 확장자 API 응답 타입
interface CustomExtensionsResponse {
  items: CustomExtensionItem[];
  count: number;
  limit: number;
}

// --- 고정 확장자(FixedExtensions) 관련 훅 ---

/**
 * 고정 확장자 목록을 서버에서 조회하는 useQuery 훅
 * API: GET /api/extensions/fixed
 */
export const useFixedExtensions = () => {
  return useQuery<FixedExtensionsResponse, Error>({
    queryKey: ["fixedExtensions"],
    queryFn: async () => {
      const { data } = await api.get("/api/extensions/fixed");
      return data;
    },
  });
};

/**
 * 고정 확장자의 차단 상태를 업데이트하는 useMutation 훅
 * API: PATCH /api/extensions/fixed
 */
type Vars = { id: number; blocked: boolean };
export const useUpdateFixedExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocked }: Vars) =>
      api.patch(`/api/extensions/fixed/${id}`, { blocked }),

    // UX 개선: 낙관적 업데이트
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["fixedExtensions"] });
      const prev = queryClient.getQueryData<any>(["fixedExtensions"]);

      queryClient.setQueryData(["fixedExtensions"], (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((it: any) =>
            it.id === vars.id ? { ...it, blocked: vars.blocked } : it
          ),
          updatedAt: new Date().toISOString(),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["fixedExtensions"], ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedExtensions"] });
    },
  });
};
// --- 커스텀 확장자(CustomExtensions) 관련 훅 ---

/**
 * 커스텀 확장자 목록을 서버에서 조회하는 useQuery 훅
 * API: GET /api/extensions/custom
 */
export const useCustomExtensions = () => {
  return useQuery<CustomExtensionsResponse, Error>({
    queryKey: ["customExtensions"],
    queryFn: async () => {
      const { data } = await api.get("/api/extensions/custom");
      return data;
    },
  });
};

/**
 * 새로운 커스텀 확장자를 추가하는 useMutation 훅
 * API: POST /api/extensions/custom
 */
export const useAddCustomExtension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newExtension: { ext: string }) => {
      return api.post("/api/extensions/custom", newExtension);
    },
    onSuccess: () => {
      // 성공 시 커스텀 확장자 목록 쿼리를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["customExtensions"] });
    },
    onError: (error: unknown, variables) => {
      const err = error as AxiosError<any>;
      const status = err.response?.status;
      const serverMsg = (err.response?.data as any)?.message;

      if (status === 409) {
        // 중복
        toast({
          variant: "destructive",
          title: "이미 추가된 확장자",
          description:
            serverMsg || `.${variables.ext} 확장자는 이미 추가되어 있습니다.`,
        });
        return;
      }

      if (status === 400) {
        toast({
          variant: "destructive",
          title: "추가 실패",
          description:
            typeof serverMsg === "string"
              ? serverMsg
              : "요청을 처리할 수 없습니다.",
        });
        return;
      }

      // 그 외 일반 에러
      toast({
        variant: "destructive",
        title: "추가 실패",
        description:
          typeof serverMsg === "string"
            ? serverMsg
            : "알 수 없는 오류가 발생했습니다.",
      });
    },
  });
};
/**
 * 커스텀 확장자를 삭제하는 useMutation 훅
 * API: DELETE /api/extensions/custom/:ext
 */
export const useDeleteCustomExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (extensionId: number) =>
      api.delete(`/api/extensions/custom/${extensionId}`),

    // 낙관적 업데이트: 먼저 리스트에서 제거
    async onMutate(extensionId) {
      await queryClient.cancelQueries({ queryKey: ["customExtensions"] });
      const prev = queryClient.getQueryData<any>(["customExtensions"]);

      // 삭제할 항목 정보(토스트 메시지용) 확보
      const removed = prev?.items?.find?.((it: any) => it.id === extensionId);

      queryClient.setQueryData(["customExtensions"], (old: any) => {
        if (!old?.items) return old;
        const nextItems = old.items.filter((it: any) => it.id !== extensionId);
        return {
          ...old,
          items: nextItems,
          count:
            typeof old.count === "number"
              ? Math.max(0, old.count - 1)
              : nextItems.length,
        };
      });

      return { prev, removed };
    },

    // 실패 시 롤백 + 분기 토스트
    onError(error, _vars, ctx) {
      if (ctx?.prev) queryClient.setQueryData(["customExtensions"], ctx.prev);

      const err = error as AxiosError<any>;
      const status = err.response?.status;
      const serverMsg = (err.response?.data as any)?.message;

      if (status === 404) {
        toast({
          variant: "destructive",
          title: "삭제 실패",
          description: "이미 삭제되었거나 존재하지 않는 항목입니다.",
        });
        return;
      }

      if (status === 400) {
        toast({
          variant: "destructive",
          title: "삭제 실패",
          description:
            typeof serverMsg === "string"
              ? serverMsg
              : "요청을 처리할 수 없습니다.",
        });
        return;
      }

      if (status === 401 || status === 403) {
        toast({
          variant: "destructive",
          title: "권한 없음",
          description: "로그인이 필요하거나 권한이 없습니다.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "알 수 없는 오류가 발생했습니다.",
      });
    },

    // 성공 토스트(항목명까지 표시)
    onSuccess(_data, _vars, ctx) {
      const ext = ctx?.removed?.ext ? `.${ctx.removed.ext}` : "항목";
      toast({ title: "삭제됨", description: `${ext}이(가) 삭제되었습니다.` });
    },

    // 최종 동기화
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["customExtensions"] });
    },
  });
};
export const useClearAllCustomExtensions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/api/extensions/custom"), // 204 예상
    // 낙관적 업데이트로 즉시 비우기
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["customExtensions"] });
      const previous = qc.getQueryData<{
        items: any[];
        count: number;
        limit: number;
      }>(["customExtensions"]);
      qc.setQueryData(["customExtensions"], (old: any) =>
        old ? { ...old, items: [], count: 0 } : old
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["customExtensions"], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["customExtensions"] });
    },
  });
};
