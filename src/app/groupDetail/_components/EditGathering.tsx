"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { editGathering } from "@/apis/assignGatheringApi";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import { Input } from "@/app/(home)/_components/Input";
import { categoryList } from "@/constants/categoryList";
import useUserStore from "@/store/userStore";
import { GatheringDetailRes } from "@/types/api/gatheringApi";
import { formatToKoreanTime } from "@/utils/date";
import {
  EditGatheringFormData,
  handleKeywordAddition,
  handleKeywordChange,
  handleKeywordDelete,
} from "@/utils/editFormHandler";
import { EditGatheringSchema } from "@/utils/editGathSchema";

type EditGatheringProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialData: GatheringDetailRes;
  onShowToast: (message: string, type: "success" | "error" | "notification") => void;
};

const ReadOnlyInput = ({ value, id }: { value: string | number; id?: string }) => {
  return (
    <input
      id={id}
      className="rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 text-gray-400 focus:border-red-300 focus:outline-none"
      value={value}
      readOnly
    />
  );
};

export default function EditGathering({
  isOpen,
  setIsOpen,
  initialData,
  onShowToast,
}: EditGatheringProps) {
  const [keywordValue, setKeywordValue] = useState<string>("");

  const {
    name,
    image,
    type,
    dateTime,
    address2,
    keyword,
    capacity,
    openParticipantCount,
    description,
  } = initialData;

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, touchedFields, isSubmitted, isValid },
  } = useForm<EditGatheringFormData>({
    resolver: zodResolver(EditGatheringSchema),
    defaultValues: {
      name,
      description,
      keyword,
      image: image || null,
    },
  });

  const keywords = watch("keyword") || [];
  const userInfo = useUserStore();

  useEffect(() => {
    if (!userInfo.id) return setIsOpen(false);
  }, [userInfo.id, setIsOpen]);

  const createFormData = (data: EditGatheringFormData): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === initialData[key as keyof GatheringDetailRes]) return;

      switch (key) {
        case "image":
          if (value instanceof File) {
            formData.append(key, value);
          } else if (initialData.image !== "") {
            // 파일이 없고 기존 이미지가 있는 경우, 빈 이미지 파일 추가
            const emptyImageFile = new File([""], "empty.png", { type: "image/png" });
            formData.append(key, emptyImageFile);
          }

          break;

        case "keyword":
          const areArraysEqual =
            value.length === initialData.keyword.length &&
            value.every((item: string, index: number) => item === initialData.keyword[index]);

          if (Array.isArray(value) && !areArraysEqual) {
            formData.append(key, value.join(",")); // 콤마로 구분된 문자열 추가
          }

          break;

        default:
          if (value !== null && value !== undefined) {
            formData.append(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
          }
      }
    });

    return formData;
  };

  const handleSubmitEdit = async (data: EditGatheringFormData) => {
    if (!userInfo.id) return setIsOpen(false);

    const formData = createFormData(data);

    if (Array.from(formData.keys()).length === 0) {
      onShowToast("변경된 내용이 없습니다.", "error");
      return;
    }

    if (!confirm("모임을 수정하시겠습니까?")) return;

    const isImageModified = formData.has("image");

    function handleApiError<T extends object>(
      response: T | { code?: string; message?: string },
    ): boolean {
      if ("code" in response && response.code) {
        console.error("HTTP Error:", response.message);
        onShowToast(response.message as string, "error");
        return true;
      }
      return false;
    }

    try {
      const response = await editGathering(initialData.id, formData);
      if (handleApiError(response)) return;

      if (isImageModified) {
        await queryClient.invalidateQueries({ queryKey: ["gatheringDetail"] });
      } else {
        queryClient.setQueryData(
          ["gatheringDetail", initialData.id],
          (oldData: GatheringDetailRes) => ({
            ...oldData,
            ...data,
          }),
        );
      }

      onShowToast("모임이 수정되었습니다.", "success");
      setIsOpen(false);
    } catch (error) {
      console.error("error", error);
      onShowToast("예기치 않은 오류가 발생했습니다. 다시 시도해주시기 바랍니다.", "error");
    }
  };

  return (
    <Modal
      aria-labelledby="edit-gathering-title"
      aria-describedby="edit-gathering-description"
      title="모임 수정"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {/* 모임 수정 타이틀 */}
      <h1 id="edit-gathering-title" className="sr-only">
        모임 수정
      </h1>
      <p id="edit-gathering-description" className="text-sm font-semibold text-gray-700">
        ✨수정 가능 항목:{" "}
        <span className="border-b-2 text-gray-700">모임 이름, 이미지, 모임 설명, 해시태그</span>
      </p>

      <form
        onSubmit={handleSubmit(handleSubmitEdit)}
        className="flex flex-col gap-4 overflow-y-scroll pb-6 font-medium"
      >
        {/* 모임 이름 */}
        <div className="flex w-full flex-col gap-1">
          <label htmlFor="name" className="font-medium">
            모임 이름
          </label>
          <Input
            id="name"
            {...register("name", {
              onChange: () => {
                trigger("name");
              },
            })}
            placeholder="모임 이름을 입력하세요"
            className={`rounded-lg p-2 ${
              errors.name
                ? "border-red-500" // 에러가 있으면 빨간색
                : isSubmitted || touchedFields.name
                  ? "border-green-500" // 제출되거나 필드가 수정된 경우 초록색
                  : "border-gray-100" // 기본 상태
            }`}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* 이미지 */}
        <div className="flex flex-col gap-1">
          <label htmlFor="fileInput" className="font-medium">
            이미지
          </label>
          <div className="flex flex-row items-center gap-2">
            {/* 파일 이름 표시 */}
            <div className="relative flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 text-gray-400">
              {(() => {
                // 브라우저 환경 확인 후 파일 정보 접근
                if (typeof window !== "undefined") {
                  const file = watch("image") as File | null | string; // File로 변경
                  if (typeof file == "string") return file;
                  else return file ? file.name : "이미지를 첨부해주세요";
                }
                return "이미지를 첨부해주세요";
              })()}
              {/* X 버튼 */}
              {watch("image") && (
                <button
                  aria-label="이미지 제거 버튼"
                  type="button"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-white hover:bg-gray-500"
                  onClick={() => {
                    setValue("image", null); // 파일 초기화
                  }}
                >
                  &times;
                </button>
              )}
            </div>

            {/* 파일 인풋 (숨김) */}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const files = e.target.files;
                if (files && files[0]) {
                  if (files[0].size > 5 * 1024 * 1024) {
                    onShowToast("이미지 크기는 5MB를 초과할 수 없습니다.", "error");
                    return;
                  }
                  if (
                    !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0].type)
                  ) {
                    onShowToast("지원하지 않는 파일 형식입니다.", "error");
                    return;
                  }
                  setValue("image", files[0]); // 단일 파일만 저장
                } else {
                  setValue("image", null); // 파일이 없으면 null
                }
              }}
            />

            {/* 커스텀 버튼 */}
            <button
              aria-label="이미지 파일 선택 버튼"
              type="button"
              onClick={() => document.getElementById("fileInput")?.click()}
              className="rounded-lg border border-orange-400 bg-white px-4 py-2 text-orange-400 hover:bg-orange-100"
            >
              파일 찾기
            </button>
          </div>

          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
        </div>

        {/* 설명 */}
        <div className="flex w-full flex-col">
          <label htmlFor="description" className="font-medium">
            모임 설명
          </label>
          <Input
            id="description"
            type="text-area"
            placeholder="모임 설명을 입력 해주세요"
            {...register("description", {
              onChange: () => {
                trigger("description");
              },
            })}
            className={`rounded-lg py-1 ${
              errors.description
                ? "border-red-500"
                : touchedFields.description || isSubmitted
                  ? "border-green-500"
                  : "border-gray-100"
            }`}
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        {/* 키워드 */}
        <div className="flex flex-col gap-1 pb-4 font-medium">
          <div className="mb-2 flex flex-row flex-wrap items-center gap-2">
            <label htmlFor="keywords" className="font-medium">
              관련 해시태그
            </label>
            {/* 키워드 리스트 */}
            <div className="flex flex-row flex-wrap items-center gap-1">
              {keywords.map((word, index) => (
                <div
                  key={index}
                  className="group relative flex items-center rounded-xl border bg-yellow-200 px-2 py-1"
                >
                  {word}
                  {/* X표시: 기본 hidden, 그룹 호버 시 나타남 */}
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-white group-hover:flex"
                    onClick={() => handleKeywordDelete(index, keywords, setValue)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 키워드 입력 */}
          <div className="flex items-center gap-2">
            <Input
              id="keywords"
              name="keywords"
              type="text"
              placeholder="키워드를 입력 후 스페이스를 눌러주세요"
              value={keywordValue}
              onChange={e => {
                handleKeywordChange(e.target.value, setKeywordValue);
              }}
              onKeyDown={e => {
                if (e.key === " ") {
                  e.preventDefault();
                  if (!e.currentTarget.value.trim()) return; // 공백 문자열 방지

                  const word = e.currentTarget.value.includes("#")
                    ? e.currentTarget.value
                    : `#${e.currentTarget.value}`;

                  handleKeywordAddition(word, keywords, setKeywordValue, setValue);
                }
              }}
              className="w-full rounded-lg border p-2"
            />
          </div>
        </div>

        {/* 아래는 수정 불가능 */}
        <div className="w-full border border-dashed"></div>

        <div className="flex w-full flex-col gap-1">
          <label htmlFor="address" className="font-medium">
            장소
          </label>
          <ReadOnlyInput id="address" value={address2} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="font-medium">
            카테고리
          </label>
          <ReadOnlyInput
            id="category"
            value={categoryList.find(({ link }) => link === type)?.name || ""}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dateTime" className="font-medium">
            날짜
          </label>
          <ReadOnlyInput id="dateTime" value={formatToKoreanTime(dateTime, "MM월 d일 HH:mm")} />
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="capacity" className="font-medium">
            모집 정원
          </label>
          <ReadOnlyInput id="capacity" value={capacity} />
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="openParticipantCount" className="font-medium">
            최소 인원
          </label>
          <ReadOnlyInput id="openParticipantCount" value={openParticipantCount} />
        </div>

        <Button
          aria-disabled={!isValid}
          type="submit"
          bgColor={`${isValid ? "yellow" : "disabled"}`}
          className={`py-2 hover:bg-yellow-primary ${isValid ? "border-green-500" : "bg-gray-300"}`}
        >
          확인
        </Button>
      </form>
    </Modal>
  );
}
