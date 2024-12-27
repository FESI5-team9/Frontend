const ReviewCardSkeleton = () => {
  return (
    <div>
      <div className="flex h-[348px] w-full flex-col gap-6 tablet:mb-6 tablet:h-[153px] tablet:flex-row">
        {/* 이미지 영역 */}
        <div className="relative h-[153px] w-[272px] max-w-[272px] animate-pulse overflow-hidden rounded-3xl bg-gray-200" />

        <div className="flex flex-1 flex-col">
          {/* 평점 영역 */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(heart => (
              <div key={heart} className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            ))}
          </div>

          {/* 코멘트 영역 */}
          <div className="mt-[10px] h-[34px] w-3/4 animate-pulse rounded bg-gray-200" />

          {/* 가게명과 위치 */}
          <div className="mt-[10px] h-4 w-48 animate-pulse rounded bg-gray-200" />

          {/* 프로필 영역 */}
          <div className="mt-2 flex items-center">
            {/* 프로필 이미지 */}
            <div className="mr-2 h-6 w-6 animate-pulse rounded-full bg-gray-200" />

            {/* 닉네임 */}
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

            {/* 구분선 */}
            <div className="mx-2 h-4 w-1 animate-pulse rounded bg-gray-200" />

            {/* 날짜 */}
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </div>

          {/* 구분선 */}
          <div className="mb-6 mt-4 w-full border border-dashed border-b-gray-disable tablet:mb-0 tablet:mt-auto" />
        </div>
      </div>
    </div>
  );
};
export default ReviewCardSkeleton;
