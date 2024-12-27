import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getReviewStats, getReviews } from "@/apis/reviewsApi";
import AllReviews from "./_components/AllReviews";

async function fetchInitialReviews() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reviews?type=RESTAURANT&page=0&size=5&sort=createdAt`,
  );
  return response.json();
}

async function fetchInitialStats() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/statistics?type=RESTAURANT`,
  );
  return response.json();
}

async function Reviews() {
  const queryClient = new QueryClient();

  // 초기 데이터 가져오기
  const initialReviews = await fetchInitialReviews();
  const initialStats = await fetchInitialStats();

  // 데이터 프리페칭
  await queryClient.prefetchQuery({
    queryKey: [
      "reviews",
      { size: 5, type: "CAFE", location: undefined, date: undefined, sort: "createdAt" },
    ],
    queryFn: () => getReviews({ type: "CAFE" }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["stats", { type: "CAFE" }],
    queryFn: () => getReviewStats("CAFE"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllReviews initialData={{ reviews: initialReviews, stats: initialStats }} />
    </HydrationBoundary>
  );
}

export default Reviews;
