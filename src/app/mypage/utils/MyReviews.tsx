import ReviewCard from "@/components/MypageCard/ReviewCard";
import { GetMyJoinedGatheringsRes } from "@/types/api/gatheringApi";
import { ReviewRes } from "@/types/api/reviews";

interface RenderContentProps {
  completedReviews: ReviewRes[];
  unCompletedReview: GetMyJoinedGatheringsRes;
}

export default function myReviews({ completedReviews, unCompletedReview }: RenderContentProps) {
  return (
    <>
      <ReviewCard review={unCompletedReview} reviewed={completedReviews} />
    </>
  );
}
