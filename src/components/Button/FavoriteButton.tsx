"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { deleteFavoriteGathering, getFavoriteGathering } from "@/apis/favoriteGatheringApi";
import Toast from "@/components/Toast";
import useToastStore from "@/store/useToastStore";
import useUserStore from "@/store/userStore";

export default function FavoriteButton({ gatheringId, initialFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(initialFavorite);

  const router = useRouter();
  const userInfo = useUserStore();
  const addToast = useToastStore(state => state.addToast);

  const updateFavoriteCount = useCallback(async () => {
    try {
      const response = await (isFavorite
        ? deleteFavoriteGathering(gatheringId)
        : getFavoriteGathering(gatheringId));

      if (response.code) {
        addToast({ message: response.message, type: "error" });
        return;
      } else {
        setIsFavorite(prev => !prev);
      }
    } catch (error) {
      console.error("업데이트 실패", error);
    }
  }, [gatheringId, isFavorite, addToast]); // 의존성 배열은 그대로

  const submitFavorite = useCallback(async () => {
    if (!userInfo.id) {
      router.push("/signin");
    } else {
      await updateFavoriteCount();
    }
  }, [userInfo, router, updateFavoriteCount]);

  return (
    <>
      <motion.button
        onClick={submitFavorite}
        className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full outline-none ${isFavorite || "border-2 border-[#E5E7EB] bg-white"}`}
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }} // 클릭 시 약간의 축소 효과
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, backgroundColor: isFavorite ? "#FFFACD" : "#FFFFFF" }}
          animate={{
            opacity: isFavorite ? 0.3 : 0,
            backgroundColor: isFavorite ? "#FFFACD" : "#FFFFFF",
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.img
          src={isFavorite ? "/images/heart/filled_heart.svg" : "/images/heart/empty_heart.svg"}
          alt="like"
          className="relative z-10 h-6 w-6"
          key={isFavorite ? "filled-heart" : "empty-heart"}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
      <Toast />
    </>
  );
}
