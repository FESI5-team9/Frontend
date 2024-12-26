"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
import useUserStore from "@/store/userStore";
import { categoryList } from "../../../constants/categoryList";
import CreateGathering from "./CreateGathering";

export default function SelectedType() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | null>>({});
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useUserStore();
  const router = useRouter();

  // URL에서 초기 필터 값 설정
  useEffect(() => {
    const params: Record<string, string | null> = {};
    searchParams.forEach((value, paramKey) => {
      params[paramKey] = value; // 'key'를 'paramKey'로 변경
    });
    setSelectedFilters(params);
  }, [searchParams]);

  // 필터 변경 핸들러
  const handleFilterChange = (filterKey: string, value: string) => {
    const updatedFilters = { ...selectedFilters };
    if (updatedFilters[filterKey] === value) {
      updatedFilters[filterKey] = null;
    } else {
      updatedFilters[filterKey] = value;
    }
    setSelectedFilters(updatedFilters);

    // URL 파라미터 업데이트
    const currentParams = new URLSearchParams(window.location.search);
    Object.entries(updatedFilters).forEach(([entryKey, val]) => {
      if (val === null) {
        currentParams.delete(entryKey); // 'key'를 'entryKey'로 변경
      } else {
        currentParams.set(entryKey, val);
      }
    });

    window.history.pushState({}, "", `?${currentParams.toString()}`);
  };
  const checkLogin = () => {
    if (id) {
      setIsModalOpen(true);
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="mb-2 flex justify-between border-b-2 pb-2">
      <CreateGathering isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <ul className="flex gap-3 p-2 text-lg tablet:justify-between tablet:gap-4">
        {categoryList.map(category => (
          <li
            key={category.name}
            className={`flex list-none items-center gap-[3px] border-b-2 hover:cursor-pointer ${
              selectedFilters.type === category.link
                ? `border-black text-black`
                : "border-transparent text-gray-400"
            }`}
            onClick={() => handleFilterChange("type", category.link)}
          >
            <p>{category.name}</p>
            <Image
              src={selectedFilters.type === category.link ? category.icon : category.disabled}
              alt={category.alt}
              width={18}
              height={20}
              className="hidden h-[20px] w-[18px] object-contain tablet:block"
            />
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          checkLogin();
        }}
        size="small"
        bgColor="yellow"
        className="w-[127px] cursor-pointer focus:outline-none"
      >
        모임 만들기
      </Button>
    </div>
  );
}
