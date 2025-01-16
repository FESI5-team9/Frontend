export default function SKCard() {
  return (
    <div className="border-gray hover:scale-102 flex w-full transform animate-pulse flex-col rounded-2xl border-y-2 bg-gray-background transition-transform duration-200 tablet:h-[156px] tablet:w-full tablet:flex-row">
      {/* 이미지 스켈레톤 */}
      <div className="relative flex rounded-l-2xl bg-gray-200 tablet:h-[153px] tablet:w-[355px]">
        <div className="absolute right-0 top-0 flex h-[20px] w-[100px] flex-row items-center gap-1 rounded-bl-xl border border-none bg-gray-300 px-2 py-1"></div>
      </div>
      {/* 텍스트 & 기타 요소 스켈레톤 */}
      <div className="flex w-full flex-col justify-between p-4">
        {/* 제목 및 주소 */}
        <div className="flex justify-between">
          <div className="flex w-2/5 flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <div className="h-5 w-3/4 rounded-md bg-gray-300"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="h-5 w-20 rounded-md bg-gray-300"></div>
              <div className="h-5 w-20 rounded-md bg-gray-300"></div>
            </div>
          </div>
          {/* 찜하기 아이콘 자리 */}
          <div className="mr-3 mt-4 h-6 w-6 rounded-full bg-gray-300"></div>
        </div>
        {/* 하단 섹션 */}
        <div className="flex items-end justify-between">
          <div className="mt-4 flex w-3/5 flex-col gap-2 tablet:w-3/5 desktop:w-3/5">
            <div className="flex flex-row gap-2 text-sm">
              <div className="flex gap-1">
                <div className="h-4 w-10 rounded-md bg-gray-300"></div>
              </div>
              <div className="h-4 w-12 rounded-md bg-gray-200"></div>
            </div>
            {/* 진행률 바 자리 */}
            <div className="h-4 w-full rounded-md bg-gray-300"></div>
          </div>
          {/* 버튼 자리 */}
          <div className="h-8 w-24 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
