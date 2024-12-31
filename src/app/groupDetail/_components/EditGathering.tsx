"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import { Input } from "@/app/(home)/_components/Input";
import { GatheringDetailRes } from "@/types/api/gatheringApi";
import { CreateGatheringSchema } from "@/utils/createGathSchema";
import { formatToKoreanTime } from "@/utils/date";
import {
  CreateGatheringFormData,
  handleKeywordAddition,
  handleKeywordChange,
  handleKeywordDelete,
} from "@/utils/formHandler";
import { categoryList } from "../../../constants/categoryList";

const ReadOnlyInput = ({ value }: { value: string | number }) => {
  return (
    <input
      className="rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 text-gray-400 focus:border-yellow-400 focus:outline-none"
      value={value}
      readOnly
    />
  );
};

export default function EditGathering({
  isOpen,
  setIsOpen,
  initialData,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialData: GatheringDetailRes;
}) {
  const [keywordValue, setKeywordValue] = useState("");

  const { name, type, dateTime, address2, keyword, capacity, openParticipantCount, description } =
    initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, touchedFields, isSubmitted, isValid },
  } = useForm<CreateGatheringFormData>({
    resolver: zodResolver(CreateGatheringSchema),
    defaultValues: {
      name,
      description,
      keyword,
    },
  });

  const keywords = watch("keyword") || [];

  return (
    <Modal title="모임 만들기" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        onSubmit={handleSubmit(data => {
          alert(data);
        })}
        className="flex flex-col gap-4 overflow-y-scroll pb-6 font-medium"
      >
        {/* 모임 이름 */}
        <div className="flex w-full flex-col gap-1">
          <p>모임 이름</p>
          <Input
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

        {/* 장소 */}
        <div className="flex w-full flex-col gap-1">
          <p>장소</p>
          <ReadOnlyInput value={address2} />
        </div>

        {/* 이미지 업로드 */}
        <div className="flex flex-col gap-1">
          <p>이미지</p>
          <div className="flex flex-row gap-2">
            {/* 파일 이름 표시 */}
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 text-gray-400">
              {(() => {
                // 브라우저 환경 확인 후 파일 정보 접근
                if (typeof window !== "undefined") {
                  const file = watch("image") as File | null; // File로 변경
                  return file ? file.name : "이미지를 첨부해주세요";
                }
                return "이미지를 첨부해주세요";
              })()}
            </div>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden border"
              onChange={e => {
                const files = e.target.files;
                if (files && files[0]) {
                  if (files[0].size > 5 * 1024 * 1024) {
                    alert("이미지 크기는 5MB를 초과할 수 없습니다.");
                    return;
                  }
                  if (
                    !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[0].type)
                  ) {
                    alert("지원하지 않는 파일 형식입니다.");
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
              type="button"
              onClick={() => document.getElementById("fileInput")?.click()}
              className="rounded-lg border border-orange-400 bg-white px-4 py-2 text-orange-400 hover:bg-orange-100"
            >
              파일 찾기
            </button>
          </div>
          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
        </div>

        {/* 카테고리 선택 */}
        <div className="flex flex-col gap-1">
          <p>카테고리</p>
          <div className="flex flex-row gap-2">
            {categoryList.map((category, index) => (
              <div
                key={index}
                className={`flex select-none items-center gap-3 rounded-lg px-2 py-1.5 font-medium ${
                  type === category.link
                    ? "border border-black bg-black text-white"
                    : "border border-gray-300 bg-gray-100 text-black"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-xl border border-gray-300 bg-white">
                  <span className={`${type === category.link ? "text-orange-500" : "hidden"}`}>
                    ✔
                  </span>
                </span>
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-1">
          <p>날짜</p>
          <ReadOnlyInput value={formatToKoreanTime(dateTime, "MM월 d일 HH:mm")} />
        </div>

        {/* 모집 정원 */}
        <div className="flex w-full flex-col">
          <p>모집 정원</p>
          <ReadOnlyInput value={capacity} />
        </div>

        {/* 최소 인원 */}
        <div className="flex w-full flex-col">
          <p>최소 인원</p>
          <ReadOnlyInput value={openParticipantCount} />
        </div>

        {/* 설명 */}
        <div className="flex w-full flex-col">
          <p>모임 설명</p>
          <Input
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
          <div className="flex flex-row items-center gap-2">
            <p>관련 해시태그</p>
            {/* 키워드 리스트 */}
            <div className="flex h-[30px] flex-row items-center gap-1">
              {keywords.map((word, index) => (
                <div
                  key={index}
                  className="text- group relative flex items-center rounded-xl border bg-yellow-200 px-2 py-1"
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
              name="keywords"
              type="text"
              placeholder="#키워드 입력 후 스페이스바"
              value={keywordValue}
              onChange={e => {
                handleKeywordChange(e.target.value, setKeywordValue);
              }}
              onKeyDown={e => {
                if (e.key === " ") {
                  e.preventDefault();
                  handleKeywordAddition(e.currentTarget.value, keywords, setKeywordValue, setValue);
                }
              }}
              className="w-full rounded-lg border p-2"
            />
          </div>
        </div>

        <Button
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
