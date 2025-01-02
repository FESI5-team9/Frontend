export default function ReviewSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-2 py-4">
      <div className="flex h-5 w-24 rounded-md bg-gray-100"></div>
      <div className="h-6 w-full rounded-md bg-gray-100 tablet:w-[400px]"></div>
      <div className="flex items-center gap-1">
        <div className="h-6 w-6 rounded-full bg-gray-200"></div>
        <div className="h-5 w-24 rounded-md bg-gray-100"></div>
        <div className="h-5 w-28 rounded-md bg-gray-100"></div>
      </div>
    </div>
  );
}
