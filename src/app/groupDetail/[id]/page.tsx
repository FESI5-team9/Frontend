import { Metadata } from "next";
import { cookies } from "next/headers";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import fetchWithMiddleware from "@/apis/fetchWithMiddleware";
import buildQueryParams from "@/hooks/queryParams";
import GroupDetail from "@/app/groupDetail/_components/GroupDetail";
import { GetReviews, GetReviewsRating } from "@/types/api/reviews";

async function getGatheringServer(id: string) {
  const accessToken = cookies().get("access-token")?.value;

  try {
    const response = await fetchWithMiddleware(
      `${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/${id}`,
      {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getGatheringServer Error:", error);
    throw error;
  }
}

async function getReviewsServer(params: GetReviews) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }

  try {
    const response = await fetchWithMiddleware(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reviews?${searchParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getReviewsServer Error:", error);
    throw error;
  }
}

async function getReviewRatingServer(params: GetReviewsRating) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }

  try {
    const response = await fetchWithMiddleware(
      `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/score?${searchParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getReviewRatingServer Error:", error);
    throw error;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { name, description } = await getGatheringServer(params.id);

  return {
    title: `${name} 상세 페이지`,
    description: description,
    openGraph: {
      title: `${name} 상세 페이지`,
      description: description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/groupDetail/${params.id}`,
    },
  };
}

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
    queryFn: () => getGatheringServer(params.id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gatheringReviews", id, 0],
    queryFn: () => getReviewsServer({ gatheringId: id, size: 4, page: 0 }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["gatheringReviewRating", id],
    queryFn: () => getReviewRatingServer({ gatheringId: id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupDetail paramsId={id} />
    </HydrationBoundary>
  );
}

export default GroupDetailPage;
