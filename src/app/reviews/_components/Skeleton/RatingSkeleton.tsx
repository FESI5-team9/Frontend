const RatingSkeleton = () => {
  return (
    <div className="border-y-2">
      <div className="mx-auto flex w-full max-w-[610px] items-center justify-between px-6 py-8">
        {/* 왼쪽 평균 점수와 하트 영역 */}
        <div className="flex h-[60px] w-[148px] flex-col items-center justify-center gap-2 pr-5">
          {/* 평균 점수 */}
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200" />

          {/* 하트 아이콘들 */}
          <div className="flex h-6 w-[120px] animate-pulse rounded-sm bg-gray-200" />
        </div>

        {/* 오른쪽 프로그레스바 영역 */}
        <div className="flex w-full max-w-[294px] flex-col gap-1">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              {/* 점수 라벨 */}
              <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />

              {/* 프로그레스바 */}
              <div className="flex-1">
                <div className="h-2 w-full animate-pulse rounded bg-gray-200" />
              </div>

              {/* 개수 */}
              <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSkeleton;
