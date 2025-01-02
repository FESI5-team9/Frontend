import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getReviews, getReviewsRating } from "@/apis/reviewsApi";
import { getGatheringDetail } from "@/apis/searchGatheringApi";
import GroupDetail from "@/app/groupDetail/_components/GroupDetail";

async function GroupDetailPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  const id = Number(params.id);

  if (!id || isNaN(id)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Invalid request. ID is required.</p>
      </div>
    );
  }

  await queryClient.prefetchQuery({
    queryKey: ["gatheringDetail", id],
    queryFn: () => getGatheringDetail(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gatheringReviews", id],
    queryFn: () => getReviews({ gatheringId: id, size: 4, page: 0 }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gatheringReviewRating", id],
    queryFn: () => getReviewsRating({ gatheringId: id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupDetail paramsId={id} />
    </HydrationBoundary>
  );
}

export default GroupDetailPage;
