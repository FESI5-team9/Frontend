"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useUserStore from "@/store/userStore";

export default function Gnb() {
  const { id, image, setUser, favoriteGatheringCount } = useUserStore();
  const [isProfileClick, setIsProfileClick] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser({
      id: null,
      email: null,
      nickname: null,
      image: null,
    });

    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 쿠키 삭제
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";

    window.location.href = "/";
  };

  const handleProfileMenuClose = () => {
    setIsProfileClick(false);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className="tablet:h-15 fixed top-0 z-30 flex h-[60px] w-full items-center justify-center bg-yellow-primary text-black">
        <div className="mx-auto flex w-full justify-between px-4 tablet:w-[744px] tablet:px-1.5 desktop:w-[1200px]">
          {/* 햄버거 버튼 */}
          <button
            type="button"
            className="relative tablet:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Image src="/icons/hamburger.svg" width={20} height={20} alt="메뉴 버튼" />
          </button>
          {isMenuOpen && (
            // 드롭다운 시안이 나오면 디자인 수정(현재 임시)
            <div className="absolute -bottom-[100px] flex h-[100px] w-[60px] flex-col items-center justify-center gap-[10px] bg-yellow-400">
              <Link
                href={"/"}
                className="hover:text-white"
                aria-label="모임 찾기"
                onClick={handleMenuClose}
              >
                모임 찾기
              </Link>
              <Link
                href={"/myFavorite/gathering"}
                className="hover:text-white"
                aria-label="찜한 모임"
                onClick={handleMenuClose}
              >
                찜한 모임
              </Link>
              <Link
                href={"/reviews"}
                className="hover:text-white"
                aria-label="모든 리뷰"
                onClick={handleMenuClose}
              >
                모든 리뷰
              </Link>
            </div>
          )}
          {/* 기본 탭 */}
          <div className="hidden items-center gap-3 tablet:flex tablet:gap-5 tablet:text-base">
            <Link href={"/"} className="block font-[800]">
              MNM
            </Link>
            <div className="flex items-center gap-3 text-sm font-semibold tablet:gap-6 tablet:text-base">
              <Link href={"/"} className="hover:text-white" aria-label="모임 찾기">
                모임 찾기
              </Link>
              <span className="flex items-center gap-[5px]">
                <Link
                  href={"/myFavorite/gathering"}
                  className="hover:text-white"
                  aria-label="찜한 모임"
                >
                  찜한 모임
                </Link>
                {favoriteGatheringCount > 0 && (
                  <span className="flex h-4 w-[27px] items-center justify-center rounded-3xl bg-[#595421] text-xs text-white">
                    {favoriteGatheringCount}
                  </span>
                )}
              </span>
              <Link href={"/reviews"} className="hover:text-white" aria-label="모든 리뷰">
                모든 리뷰
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-5 tablet:gap-6">
              <Link href={`/search/${id}`}>
                <Image src="/icons/magnifier.svg" width={24} height={24} alt="검색" />
              </Link>
              {id ? (
                // 로그인 상태면 유저 프로필
                <button
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
                  aria-label="유저 프로필"
                  onClick={() => setIsProfileClick(!isProfileClick)}
                >
                  <Image src={image || "/images/profile.svg"} fill objectFit="cover" alt="프로필" />
                </button>
              ) : (
                // 비로그인 상태면 로그인 링크
                <Link
                  href={"/signin"}
                  className="text-sm font-semibold hover:text-white tablet:text-base"
                  aria-label="로그인"
                >
                  로그인
                </Link>
              )}
            </div>
            {isProfileClick && (
              <div className="absolute right-1 top-[50px] flex h-[80px] w-[110px] flex-col justify-start rounded-2xl bg-white shadow-lg desktop:h-[88px] desktop:w-[142px]">
                <Link
                  href={"/mypage"}
                  className="inline-block h-10 py-[10px] pl-3 text-sm tablet:h-11 tablet:pl-4 tablet:text-base"
                  onClick={handleProfileMenuClose}
                >
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-10 py-[10px] pl-3 text-left text-sm tablet:h-11 tablet:pl-4 tablet:text-base"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
