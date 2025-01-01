import { Metadata } from "next";
import { cookies } from "next/headers";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getGatheringDetail } from "@/apis/searchGatheringApi";
import GroupDetail from "../_components/GroupDetail";

async function getGatheringServer(id: string) {
  const accessToken = cookies().get("access-token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/${id}`, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  return response.json();
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
    queryFn: () => getGatheringDetail(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupDetail paramsId={id} />
    </HydrationBoundary>
  );
}

export default GroupDetailPage;
