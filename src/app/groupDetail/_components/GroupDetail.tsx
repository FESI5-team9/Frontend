"use client";

import { useState } from "react";
import Image from "next/image";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getGatheringDetail } from "@/apis/searchGatheringApi";
import ClosingTimeTag from "@/components/ClosingTimeTag";
import { GatheringDetailRes } from "@/types/api/gatheringApi";
import { formatToKoreanTime } from "@/utils/date";
import DetailCard from "../_components/DetailCard";
import FixedBottomBar from "../_components/FixedBottomBar";
import Map from "../_components/Map";
import Reviews from "../_components/Reviews";
import EditGathering from "./EditGathering";

function GroupDetail({ paramsId }: { paramsId: number }) {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const {
    data: detail,
    isLoading: isDetailLoading,
    error: detailError,
  }: UseQueryResult<GatheringDetailRes, Error> = useQuery({
    queryKey: ["gatheringDetail", paramsId],
    queryFn: () => getGatheringDetail(Number(paramsId)),
    staleTime: 1000 * 60 * 5,
  });

  if (isDetailLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center text-gray-100">
        <p>Loading...</p>
      </div>
    );

  if (detailError)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Error occurred while fetching data.</p>
      </div>
    );

  return (
    <div className="mx-auto min-w-[320px] max-w-[1200px] px-4 tablet:px-8 desktop:px-[62px]">
      {detail && (
        <div
          className={`desktop:grid-areas-custom grid gap-6 py-4 tablet:grid-cols-2 tablet:gap-6 tablet:p-6 desktop:px-[62px]`}
        >
          <div
            style={{ backgroundImage: `url(${detail.image})` }}
            className="desktop:grid-area-topLeft relative min-h-[180px] overflow-hidden rounded-3xl border border-white bg-gray-200 bg-cover bg-center bg-no-repeat tablet:min-h-[270px] desktop:mb-20"
          >
            <ClosingTimeTag deadline={detail.registrationEnd} />
          </div>

          <div className="desktop:grid-area-topRight min-h-[240px] tablet:min-h-[270px]">
            <DetailCard gathering={detail} />
          </div>

          <div className="desktop:grid-area-bottom flex flex-col gap-4 px-1 tablet:col-span-2 tablet:px-6 desktop:-mt-6">
            <h3 className="text-lg font-semibold">모임 설명</h3>
            <p className="text-sm font-medium">{detail.description}</p>
            <div className="flex items-center gap-1 text-xs font-medium">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full">
                  <Image
                    src={detail.user.image ? detail.user.image : "/images/profile.svg"}
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
          </div>

          {detail.address2 && (
            <div className="desktop:grid-area-bottomRight tablet:col-span-2 tablet:h-[206px] tablet:px-6 desktop:px-0">
              <Map address={detail.address2} />
            </div>
          )}
        </div>
      )}

      <div className="w-full pb-[134px] tablet:px-6 desktop:px-[62px]">
        <Reviews gatheringId={paramsId} />
      </div>

      {detail && (
        <FixedBottomBar
          data={detail}
          gatheringId={paramsId}
          toggleEditModal={() => setIsEditOpen(true)}
        />
      )}

      {detail && isEditOpen && (
        <EditGathering isOpen={isEditOpen} setIsOpen={setIsEditOpen} initialData={detail} />
      )}
    </div>
  );
}

export default GroupDetail;
