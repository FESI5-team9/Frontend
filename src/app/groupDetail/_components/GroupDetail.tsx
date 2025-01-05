"use client";

import { useState } from "react";
import Image from "next/image";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getGatheringDetail } from "@/apis/searchGatheringApi";
import ClosingTimeTag from "@/components/ClosingTimeTag";
import Toast from "@/components/Toast";
import DetailCard from "@/app/groupDetail/_components/DetailCard";
import EditGathering from "@/app/groupDetail/_components/EditGathering";
import FixedBottomBar from "@/app/groupDetail/_components/FixedBottomBar";
import Map from "@/app/groupDetail/_components/Map";
import Reviews from "@/app/groupDetail/_components/Reviews";
import DetailSkeleton from "@/app/groupDetail/_components/Skeleton/DetailSkeleton";
import useToastStore from "@/store/useToastStore";
import { GatheringDetailRes } from "@/types/api/gatheringApi";
import { formatToKoreanTime } from "@/utils/date";

function GroupDetail({ paramsId }: { paramsId: number }) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const addToast = useToastStore(state => state.addToast);

  const showToast = (message: string, type: "success" | "error" | "notification") => {
    addToast({ message, type });
  };

  const {
    data: detail,
    isLoading: isDetailLoading,
    error: detailError,
  }: UseQueryResult<GatheringDetailRes, Error> = useQuery({
    queryKey: ["gatheringDetail", paramsId],
    queryFn: () => getGatheringDetail(Number(paramsId)),
    staleTime: 1000 * 60 * 5,
  });

  if (detailError)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>예기치 않은 오류가 발생했습니다.</p>
      </div>
    );

  return (
    <div className="mx-auto min-w-[320px] max-w-[1200px] px-4 tablet:px-8 desktop:px-[62px]">
      {isDetailLoading ? (
        <DetailSkeleton />
      ) : (
        detail && (
          <article
            className={`desktop:grid-areas-custom grid gap-6 py-4 tablet:grid-cols-2 tablet:gap-6 tablet:p-6 desktop:px-[62px]`}
          >
            <div className="desktop:grid-area-topLeft relative min-h-[180px] overflow-hidden rounded-3xl border border-white bg-gray-200 bg-cover bg-center bg-no-repeat tablet:min-h-[270px] desktop:mb-20">
              <Image
                src={detail.image || "/images/default-gathering.svg"}
                alt="모임 이미지"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                className="z-0"
                priority
              />
              <ClosingTimeTag deadline={detail.registrationEnd} />
            </div>

            <section className="desktop:grid-area-topRight min-h-[240px] tablet:min-h-[270px]">
              <DetailCard gathering={detail} />
            </section>

            <section className="desktop:grid-area-bottom flex flex-col gap-4 px-1 tablet:col-span-2 tablet:px-6 desktop:-mt-6">
              <h2 className="text-lg font-semibold">모임 설명</h2>
              <p className="text-sm font-medium">{detail.description}</p>
              <div className="flex items-center gap-1 text-xs font-medium">
                <div className="flex items-center gap-1">
                  <div className="h-6 w-6 rounded-full">
                    <Image
                      src={detail.user.image || "/images/profile.svg"}
                      alt="작성자"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span>{detail.user.nickname}</span>
                </div>
                <span className="text-[#3C3C3C]">|</span>
                <span className="text-[#9CA3AF]">
                  {formatToKoreanTime(detail.createdAt, "yyyy.MM.dd")}
                </span>
              </div>
            </section>

            {detail.address2 && (
              <section className="desktop:grid-area-bottomRight tablet:col-span-2 tablet:h-[206px] tablet:px-6 desktop:px-0">
                <Map address={detail.address2} />
              </section>
            )}
          </article>
        )
      )}

      <section className="w-full pb-[134px] tablet:px-6 desktop:px-[62px]">
        <Reviews gatheringId={paramsId} />
      </section>

      {detail && (
        <FixedBottomBar
          data={detail}
          gatheringId={paramsId}
          toggleEditModal={() => setIsEditOpen(true)}
          onShowToast={showToast}
        />
      )}

      {detail && isEditOpen && (
        <EditGathering
          onShowToast={showToast}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          initialData={detail}
        />
      )}

      <Toast />
    </div>
  );
}

export default GroupDetail;
