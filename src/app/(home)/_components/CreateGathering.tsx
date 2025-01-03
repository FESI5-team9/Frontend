"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/Button/Button";
import Calendar from "@/components/Calendar/Calendar";
import Kakao from "@/components/Kakaomap/Kakao";
import Modal from "@/components/Modal";
import useDateStore from "@/store/dateStore";
import { CreateGatheringSchema } from "@/utils/createGathSchema";
import {
  CreateGatheringFormData,
  handleKeywordAddition,
  handleKeywordChange,
  handleKeywordDelete,
  handleSubmitToServer,
} from "@/utils/formHandler";
import { categoryList, timeChips } from "../../../constants/categoryList";
import { Input } from "./Input";

export default function CreateGathering({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 주소 검색 상태
  const [selectedTime, setSelectedTime] = useState<string>(""); // 선택된 시간
  const [selectedService, setSelectedService] = useState<string>("RESTAURANT"); // 선택된 카테고리
  const [keywordValue, setKeywordValue] = useState("");
  const { firstDate } = useDateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      name: "",
      type: "RESTAURANT",
      location: "",
      address1: "",
      address2: "",
      dateTime: "",
      capacity: 5,
      openParticipantCount: 2,
      description: "",
      image: null,
    },
  });

  const keywords = watch("keyword") || [];

  useEffect(() => {
    if (firstDate && selectedTime) {
      setValue("dateTime", `${firstDate.split("T")[0]}T${selectedTime}:00`);
      trigger("dateTime"); // 유효성 검사 실행
    }
  }, [firstDate, selectedTime, setValue, trigger]);

  return (
    <Modal title="모임 만들기" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        onSubmit={handleSubmit(data => handleSubmitToServer(data, setIsOpen))}
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
          <div
            className="relative flex items-center hover:cursor-pointer"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
          >
            <Input
              placeholder="장소를 선택해주세요"
              readOnly
              {...register("address2", {
                onChange: () => {
                  trigger("address2");
                },
              })}
              className={`flex-1 rounded-lg border bg-gray-100 px-2 py-2 hover:cursor-pointer ${
                errors.address2
                  ? "border-red-500" // 에러가 있으면 빨간색
                  : isSubmitted || touchedFields.address2
                    ? "border-green-500" // 제출되거나 필드가 수정된 경우 초록색
                    : "border-gray-100" // 기본 상태
              }`}
            />

            <button className="absolute right-2" type="button">
              <Image
                src="/icons/magnifier.svg"
                alt="searchImage"
                width={20}
                height={20}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </button>
          </div>
          {isSearchOpen && (
            <Kakao
              onAddressSelect={(location, address1, address2) => {
                setValue("location", location);
                setValue("address1", address1);
                setValue("address2", address2);
                trigger(["location", "address1", "address2"]);
                setIsSearchOpen(false);
              }}
            />
          )}
          {errors.address2 && <p className="text-red-500">{errors.address2.message}</p>}
        </div>

        {/* 이미지 업로드 */}
        <div className="flex flex-col gap-1">
          <p>이미지</p>
          <div className="flex flex-row items-center gap-2">
            {/* 파일 이름 표시 */}
            <div className="relative flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 text-gray-400">
              {(() => {
                // 브라우저 환경 확인 후 파일 정보 접근
                if (typeof window !== "undefined") {
                  const file = watch("image") as File | null; // File로 변경
                  return file ? file.name : "이미지를 첨부해주세요";
                }
                return "이미지를 첨부해주세요";
              })()}
              {/* X 버튼 */}
              {watch("image") && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-white hover:bg-gray-500"
                  onClick={() => {
                    setValue("image", null); // 파일 초기화
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // input 초기화
                    }
                  }}
                >
                  &times;
                </button>
              )}
            </div>

            {/* 파일 인풋 (숨김) */}
            <input
              type="file"
              ref={fileInputRef}
              id="fileInput"
              accept="image/*"
              className="hidden"
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
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedService(category.link); // 선택된 서비스 업데이트
                  setValue("type", category.link); // 폼 데이터에 저장
                  trigger("type"); // 유효성 검사 실행
                }}
                className={`flex items-center gap-3 rounded-lg px-2 py-1.5 font-medium ${
                  selectedService === category.link
                    ? "border border-black bg-black text-white"
                    : "border border-gray-300 bg-gray-100 text-black"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-xl border border-gray-300 bg-white">
                  <span
                    className={`${
                      selectedService === category.link ? "text-orange-500" : "hidden"
                    }`}
                  >
                    ✔
                  </span>
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <div className="flex flex-col gap-1">
          <p>날짜</p>
          <div className="flex w-full justify-center border">
            <Calendar multipleDates={false} />
          </div>
        </div>
        {/* 시간 */}
        <div className="flex flex-col gap-1">
          <p>시간</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 overflow-x-scroll">
            {timeChips.map((time, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedTime(time);
                  setValue("dateTime", time); // time 필드 업데이트
                  trigger("dateTime"); // 유효성 검사 실행
                }}
                className={`${
                  selectedTime === time ? "bg-gray-700 text-white" : "bg-gray-100"
                } flex h-[30px] w-[57px] items-center justify-center rounded-lg border p-1 hover:cursor-pointer ${
                  errors.dateTime
                    ? "border-red-500" // 에러가 있으면 빨간색
                    : isSubmitted || touchedFields.dateTime
                      ? "border-green-500" // 제출되거나 필드가 수정된 경우 초록색
                      : "border-gray-100" // 기본 상태
                }`}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* 모집 정원 */}
        <div className="flex w-full flex-col">
          <p>모집 정원</p>
          <Input
            type="number"
            placeholder="최소 5인이상 입력해주세요"
            {...register("capacity", {
              valueAsNumber: true,
              onChange: () => trigger(["openParticipantCount", "capacity"]),
            })}
            className={`rounded-lg border p-2 ${
              errors.capacity
                ? "border-red-500"
                : touchedFields.capacity || isSubmitted
                  ? "border-green-500"
                  : "border-gray-100"
            }`}
          />
          {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
        </div>

        {/* 최소 인원 */}
        <div className="flex w-full flex-col">
          <p>최소 인원</p>
          <Input
            type="number"
            placeholder="최소 인원을 입력 해주세요"
            {...register("openParticipantCount", {
              valueAsNumber: true,
              onChange: () => trigger(["openParticipantCount", "capacity"]),
            })}
            className={`rounded-lg border p-2 ${
              errors.openParticipantCount
                ? "border-red-500"
                : touchedFields.openParticipantCount || isSubmitted
                  ? "border-green-500"
                  : "border-gray-100"
            }`}
          />
          {errors.openParticipantCount && (
            <p className="text-red-500">{errors.openParticipantCount.message}</p>
          )}
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
          <div className="mb-2 flex flex-row flex-wrap items-center gap-2">
            <p>관련 해시태그</p>
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
