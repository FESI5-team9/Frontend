import { z } from "zod";

const now = new Date();

export const CreateGatheringSchema = z
  .object({
    name: z
      .string()
      .min(1, "모임 이름은 필수 입력입니다.")
      .max(50, "모임 이름은 최대 50자까지 가능합니다."),

    location: z.string().min(1, "장소를 선택해주세요."),
    address1: z.string().min(1, "장소를 선택해주세요."),
    address2: z.string().min(1, "장소를 선택해주세요."),
    image: z.any().optional(),

    dateTime: z
      .string()
      .optional()
      .superRefine((value, ctx) => {
        const [date, time] = value?.split("T") || [null, null];

        // 날짜만 없을 때 에러 추가
        if (!date && time) {
          ctx.addIssue({
            code: "custom",
            message: "날짜를 선택해주세요.",
            path: ["dateTime"],
          });
          return;
        }
        // 시간만 없을 때 에러 추가
        if (date && !time) {
          ctx.addIssue({
            code: "custom",
            message: "시간을 선택해주세요.",
            path: ["dateTime"],
          });
          return;
        }
        // 날짜와 시간이 모두 없는 경우
        if (!date && !time) {
          ctx.addIssue({
            code: "custom",
            message: "날짜와 시간을 선택해주세요.",
            path: ["dateTime"],
          });
          return;
        }

        if (date && time) {
          const dateTime = new Date(value!);

          // 유효하지 않은 날짜 확인
          if (isNaN(dateTime.getTime())) {
            ctx.addIssue({
              code: "custom",
              message: "날짜와 시간을 정확히 선택해주세요.",
              path: ["dateTime"],
            });
            return;
          }

          // 과거 날짜 선택 불가
          if (dateTime < now) {
            ctx.addIssue({
              code: "custom",
              message: "과거의 날짜는 선택할 수 없어요.",
              path: ["dateTime"],
            });
            return;
          }

          // 최대 61일까지만 선택 가능
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 61);
          if (dateTime > maxDate) {
            ctx.addIssue({
              code: "custom",
              message: "날짜는 최대 61일까지만 선택할 수 있습니다.",
              path: ["dateTime"],
            });
          }
        }
      }),

    type: z.string().min(1, "카테고리는 필수입니다."),

    capacity: z
      .number({ invalid_type_error: "숫자만 입력 가능해요." })
      .min(5, "최소 5명 이상이어야 해요.")
      .max(1000, "최대 1000명까지 가능해요."),

    openParticipantCount: z
      .number({ invalid_type_error: "최소 인원은 숫자여야 합니다." })
      .min(2, "2인 이상이어야해요"),

    description: z.string().min(1, "모임 설명을 입력 해주세요."),

    keyword: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.openParticipantCount > data.capacity) {
      ctx.addIssue({
        code: "custom",
        path: ["openParticipantCount"],
        message: "최소 인원은 모집 정원보다 클 수 없어요.",
      });
    }
  });
