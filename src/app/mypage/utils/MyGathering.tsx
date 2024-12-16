import { useGatherings } from "@/hooks/useGatherings";
import MypageCard from "@/components/MypageCard/MypageCard";
import { GetMyJoinedGathering } from "@/types/api/gatheringApi";

export const MyGathering = () => {
  const { gatherings, loading, error } = useGatherings();

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return gatherings.map((gathering: GetMyJoinedGathering, index) => (
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
      />
      {/* 구분선 추가 (마지막 요소 제외) */}
      {index !== gatherings.length - 1 && (
        <div className="mb-6 mt-6 border-[2px] border-dashed border-gray-200"></div>
      )}
    </div>
  ));
};
