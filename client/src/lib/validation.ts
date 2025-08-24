import { z } from "zod";

export const EXT_REGEX = /^[a-z0-9]+(\.[a-z0-9]+)*$/; // 앞/뒤 점 금지, 중간 점만 허용

export const extensionSchema = z
  .string()
  .min(1, "확장자를 입력해주세요")
  .max(20, "확장자는 최대 20자까지 입력 가능합니다")
  .regex(
    EXT_REGEX,
    "소문자/숫자와 중간의 점(.)만 허용합니다. 앞·뒤 점, 공백, 대문자는 불가합니다."
  )
  .refine((v) => !v.includes(","), "쉼표(,)는 허용되지 않습니다");

export const addCustomExtensionSchema = z.object({
  extension: extensionSchema,
});

export type AddCustomExtensionForm = z.infer<typeof addCustomExtensionSchema>;
