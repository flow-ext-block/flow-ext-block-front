import { z } from 'zod';

export function normalizeExt(input: string): string {
  return input
    .trim()
    .replace(/^\.*/, '') // Remove leading dots
    .toLowerCase();
}

export const extensionSchema = z
  .string()
  .min(1, '확장자를 입력해주세요')
  .max(20, '확장자는 최대 20자까지 입력 가능합니다')
  .transform(normalizeExt)
  .refine(
    (ext) => /^[a-z0-9]+$/.test(ext),
    '확장자는 소문자와 숫자만 사용할 수 있습니다'
  );

export const addCustomExtensionSchema = z.object({
  extension: extensionSchema,
});

export type AddCustomExtensionForm = z.infer<typeof addCustomExtensionSchema>;
