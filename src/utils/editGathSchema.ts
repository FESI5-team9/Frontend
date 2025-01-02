import { z } from "zod";

export const EditGatheringSchema = z.object({
  name: z
    .string()
    .min(1, "모임 이름을 입력 해주세요.")
    .max(50, "모임 이름은 최대 50자까지 가능합니다."),

  image: z.any().optional(),

  description: z.string().min(1, "모임 설명을 입력 해주세요."),

  keyword: z.array(z.string()).optional(),
});
