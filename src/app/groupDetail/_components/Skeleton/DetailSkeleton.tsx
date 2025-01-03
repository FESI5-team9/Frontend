export default function DetailSkeleton() {
  return (
    <div
      className={`desktop:grid-areas-custom grid gap-6 py-4 tablet:grid-cols-2 tablet:gap-6 tablet:p-6 desktop:px-[62px]`}
    >
      <div className="desktop:grid-area-topLeft relative min-h-[180px] overflow-hidden rounded-3xl border border-white bg-gray-200 bg-cover bg-center bg-no-repeat tablet:min-h-[270px] desktop:mb-20"></div>
      <div className="desktop:grid-area-topRight h-[240px] rounded-3xl bg-gray-100 tablet:h-[270px]"></div>
      <div className="desktop:grid-area-bottom flex flex-col gap-4 px-1 tablet:col-span-2 tablet:px-6 desktop:-mt-6">
        <div className="flex h-5 w-20 rounded-md bg-gray-100"></div>
        <div className="flex h-5 w-60 rounded-md bg-gray-100"></div>

        <div className="flex items-center gap-1 text-xs font-medium">
          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
          <div className="h-5 w-24 rounded-md bg-gray-100"></div>
          <div className="h-5 w-28 rounded-md bg-gray-100"></div>
        </div>
      </div>
      <div className="desktop:grid-area-bottomRight tablet:col-span-2 tablet:h-[206px] tablet:px-6 desktop:px-0">
        <div className="h-[336px] w-full rounded-2xl bg-gray-100 tablet:h-[180px]"></div>
        <div className="mt-2 flex h-6 w-60 rounded-md bg-gray-100"></div>
      </div>
    </div>
  );
}
