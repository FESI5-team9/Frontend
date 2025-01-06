import { useCallback, useRef } from "react";
import { useGatherings } from "@/hooks/useGatherings";
import MypageCard from "@/components/MypageCard/MypageCard";
import { SkeletonUncompleted } from "../components/Skeleton";

export const MyGathering = () => {
  const { gatherings, loading, error, loadMore, hasMore } = useGatherings();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastGatheringRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  if (error) return <p>{error}</p>;

  return (
    <div>
      {gatherings.map((gathering, index) => {
        const isLastItem = index === gatherings.length - 1;

        return (
          <div ref={isLastItem ? lastGatheringRef : null} key={gathering.id}>
            <MypageCard
              id={gathering.id}
              name={gathering.name}
              location={gathering.location}
              address1={gathering.address1}
              dateTime={gathering.dateTime}
              image={gathering.image}
              participantCount={gathering.participantCount}
              capacity={gathering.capacity}
            />
            {/* 구분선 추가 (마지막 요소 제외) */}
            {index !== gatherings.length - 1 && (
              <div className="mb-5 mt-5 border-[1.6px] border-dashed border-gray-200"></div>
            )}
          </div>
        );
      })}
      {loading && hasMore && <SkeletonUncompleted />}
    </div>
  );
};
