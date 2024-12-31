"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  deleteFavoriteGathering,
  getFavoriteGathering,
  getFavoriteGatherings,
} from "@/apis/favoriteGatheringApi";
import useUserStore from "@/store/userStore";

export default function FavoriteButton({ gatheringId, initialFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(initialFavorite);

  const router = useRouter();
  const userInfo = useUserStore();

  const updateFavoriteCount = useCallback(async () => {
    try {
      const favoriteGatherings = await getFavoriteGatherings({ size: 10, page: 0 }); // 서버에서 찜한 모임 목록 가져오기
      userInfo.setFavoriteGatheringCount(favoriteGatherings.length); // 상태 갱신 (개수만 저장)
    } catch (error) {
      console.error("Failed to update favorite count:", error);
    }
  }, [userInfo]);

  const submitFavorite = useCallback(async () => {
    if (!userInfo.id) return router.push("/signin");

    if (isFavorite) {
      const response = await deleteFavoriteGathering(gatheringId);
      if (response.code) return alert(response.message);
    } else {
      const response = await getFavoriteGathering(gatheringId);
      if (response.code) return alert(response.message);
    }

    setIsFavorite(prev => !prev);
    await updateFavoriteCount(); // 상태 갱신 (개수만 갱신)
  }, [isFavorite, gatheringId, userInfo.id, router, updateFavoriteCount]);

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
    </>
  );
}
