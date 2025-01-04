"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { updateUserProfile } from "@/apis/authApi";
import { useReviews } from "@/hooks/useReviews";
import { useUserProfile } from "@/hooks/useUserProfile";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import { MyGathering } from "@/app/mypage/utils/MyGathering";
import MyReviews from "@/app/mypage/utils/MyReviews";
import MyCreatedGathering from "./utils/MyCreatedGathering";

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("reviews");
  const { userProfile, setUserProfile } = useUserProfile();
  const { completedReviews, unCompletedReviews } = useReviews();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(userProfile?.nickname || ""); // 닉네임 상태 관리
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 선택된 파일 상태 관리

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    // 서버에 업로드 및 프로필 사진 업데이트
    try {
      const updatedUser = await updateUserProfile({
        nickname: userProfile?.nickname || "",
        image: file,
      });
      setUserProfile(updatedUser);
    } catch (err) {}
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile({
        nickname: nickname || userProfile?.nickname,
        image: selectedFile,
      });
      setUserProfile(updatedUser);
      setIsModalOpen(false);
    } catch (err) {
      alert("프로필 업데이트 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleImageEditClick = () => {
    fileInputRef.current?.click();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (activeTab === "gathering") {
      // Fetch gatherings logic
    } else if (activeTab === "reviews") {
      // Fetch reviews logic
    }
  }, [activeTab]);

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-[343px] flex-col justify-center gap-5 tablet:w-[696px] desktop:w-[996px]">
        <div className="w-full pt-6">
          <h1 className="text-lg font-semibold tablet:text-2xl">마이 페이지</h1>
        </div>
        <div className="h-[178px] w-full rounded-3xl border-[2px] border-gray-300 bg-white tablet:h-[172px]">
          <div className="relative">
            <span className="absolute left-[24px] top-[57px] flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full bg-white outline outline-gray-300">
              <Image
                src={userProfile?.image || "/images/lemonProfile.svg"}
                fill
                alt="프로필 이미지"
                className=""
              />
            </span>
          </div>
          <div className="flex h-[58px] justify-between rounded-t-3xl border-b-[2px] border-b-gray-300 bg-[#FFFACD] px-[25px] py-4 text-base text-gray-900">
            <span className="flex items-center text-lg font-semibold text-gray-900">내 프로필</span>
            <button onClick={toggleModal}>
              <Image src="/images/modify.svg" width={32} height={32} alt="프로필 정보 수정하기" />
            </button>
          </div>
          <div className="mt-[20px] flex flex-col gap-[9px] pl-[92px] text-sm text-gray-800">
            <span className="text-base font-semibold leading-normal">{userProfile?.nickname}</span>{" "}
            <span className="flex gap-1.5">
              <p>E-mail :</p> <p className="text-gray-700">{userProfile?.email}</p>{" "}
            </span>
          </div>
        </div>
        <div className="border-t-2 border-black bg-white">
          <div className="mx-auto mt-6 flex h-[34px] gap-3 pl-6">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-lg font-semibold ${
                activeTab === "reviews" ? "border-b-2 border-black text-gray-900" : "text-[#9CA3AF]"
              }`}
            >
              나의 리뷰
            </button>
            <button
              onClick={() => setActiveTab("gathering")}
              className={`text-lg font-semibold ${
                activeTab === "gathering"
                  ? "border-b-2 border-black text-gray-900"
                  : "text-[#9CA3AF]"
              }`}
            >
              나의 모임
            </button>
            <button
              onClick={() => setActiveTab("createdGathering")}
              className={`text-lg font-semibold ${
                activeTab === "createdGathering"
                  ? "border-b-2 border-black text-gray-900"
                  : "text-[#9CA3AF]"
              }`}
            >
              내가 만든 모임
            </button>
          </div>
          <div className="px-[26.5px] py-6">
            {/* 리뷰 탭 */}
            {activeTab === "reviews" && (
              <MyReviews
                completedReviews={completedReviews || []}
                unCompletedReview={unCompletedReviews || []}
              />
            )}
            {/* 나의 모임 탭 */}
            {activeTab === "gathering" && <MyGathering />}
            {/* 내가 만든 모임 탭 */}
            {activeTab === "createdGathering" && <MyCreatedGathering />}
          </div>
        </div>
      </div>
      {/* 모달 컴포넌트 */}
      <Modal title="프로필 수정하기" isOpen={isModalOpen} onClose={toggleModal}>
        <div className="mt-2 flex flex-col gap-6">
          <div className="relative">
            <span className="relative flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full outline outline-gray-300">
              <Image
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : userProfile?.image || "/images/default-profile.svg"
                }
                fill
                alt="프로필 이미지"
                className=""
              />
            </span>
            <button
              className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white"
              onClick={handleImageEditClick}
            ></button>
            <label
              htmlFor="profileImage"
              className="absolute left-9 top-9 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white"
            >
              <Image src="/images/modify.svg" width={18} height={18} alt="프로필 이미지 수정" />
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="">닉네임</span>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder={userProfile?.nickname}
              className="h-11 w-full rounded-2xl bg-gray-50 py-[10px] pl-4 text-gray-900 focus:outline focus:outline-yellow-primary"
            ></input>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={toggleModal}
              isFilled
              className="h-11 w-full border border-orange-primary text-orange-primary"
            >
              취소
            </Button>
            <Button onClick={handleUpdateProfile} className="h-11 w-full bg-gray-400 text-white">
              수정하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
