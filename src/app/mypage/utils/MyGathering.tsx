import { useGatherings } from "@/hooks/useGatherings";
import MypageCard from "@/components/MypageCard/MypageCard";
import { SkeletonUncompleted } from "../components/Skeleton";

export const MyGathering = () => {
  const { gatherings, loading, error } = useGatherings();

  if (loading) return <SkeletonUncompleted />;
  if (error) return <p>{error}</p>;

  return gatherings.map((gathering, index) => (
    <div key={gathering.id}>
      <MypageCard
        id={gathering.id}
        name={gathering.name}
        location={gathering.location}
        address1={gathering.address1}
        dateTime={gathering.dateTime}
        image={gathering.image}
        participantCount={gathering.participantCount}
        capacity={gathering.capacity}
        canceledAt={gathering.canceledAt}
      />
      {/* 구분선 추가 (마지막 요소 제외) */}
      {index !== gatherings.length - 1 && (
        <div className="mb-[21px] mt-[10px] border-[1.6px] border-dashed border-gray-200"></div>
      )}
    </div>
  ));
};
