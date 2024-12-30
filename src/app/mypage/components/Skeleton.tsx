// 작성한 리뷰 스켈레톤톤
export const SkeletonCompleted = () => {
  return (
    <div className="mb-6 animate-pulse bg-gray-100">
      <div className="flex w-full flex-col gap-6 bg-gray-100 tablet:h-[153px] tablet:flex-row">
        <div className="relative flex h-[171px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gray-300 tablet:h-[153px] tablet:w-[272px]"></div>
        <div className="flex w-full flex-col bg-gray-100">
          <div className="flex h-6 w-6 items-center text-3xl text-gray-300">♥♥♥♥♥</div>
          <p className="mt-[10px] inline-block h-3 w-full rounded-3xl bg-gray-300 text-sm text-gray-800"></p>
          <p className="mt-[5px] inline-block h-3 w-full rounded-3xl bg-gray-300 text-sm text-gray-800"></p>
          <span className="mt-[10px] inline-block h-3 w-[150px] rounded-3xl bg-gray-300 text-xs text-gray-800"></span>
          <span className="mt-2 inline-block h-3 w-[100px] rounded-3xl bg-gray-300 text-xs text-gray-disable"></span>
          <div className="mt-auto hidden border-[2px] border-dashed bg-gray-300 tablet:block"></div>
        </div>
      </div>
    </div>
  );
};

// 작성 가능한 리뷰/나의 모임 스켈레톤
export const SkeletonUncompleted = () => {
  return (
    <div className="w-full animate-pulse rounded-3xl bg-gray-100">
      <div className="flex w-full flex-col gap-4 tablet:flex-row">
        <div className="relative h-[153px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gray-300 tablet:w-[272px]"></div>
        <div className="flex w-full flex-col">
          <div className="mb-3 flex gap-2"></div>
          <div className="flex w-full gap-3">
            <div className="mb-[18px] flex flex-col gap-1.5">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block h-7 w-[135px] truncate rounded-3xl bg-gray-300"></span>
                <span className="inline-block text-gray-300">|</span>
                <span className="text-#3C3C3C inline-block h-5 w-20 max-w-[135px] truncate rounded-3xl bg-gray-300 text-sm"></span>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-#3C3C3C flex h-5 w-[100px] gap-3 rounded-3xl bg-gray-300 text-sm"></span>
                <span className="flex gap-0.5">
                  <span className="inline-block h-5 w-[70px] rounded-3xl bg-gray-300 text-sm"></span>
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto h-10 w-[108px] rounded-xl bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};
