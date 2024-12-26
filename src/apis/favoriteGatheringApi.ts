import buildQueryParams from "@/hooks/queryParams";
import { GatheringsFavoriteRes, PaginationParams } from "@/types/api/gatheringApi";
import fetchWithMiddleware from "./fetchWithMiddleware";

// 모임 찜하기
export async function getFavoriteGathering(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/favorite`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

// 모임 찜하기 취소하기
export async function deleteFavoriteGathering(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/favorite`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

// 찜한 모임 목록 조회
export async function getFavoriteGatherings(params: PaginationParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    buildQueryParams(searchParams, params);
  }
  const response = await fetchWithMiddleware(`/api/gatherings/favorite?${searchParams.toString()}`);
  const data: GatheringsFavoriteRes = await response.json();
  return data;
}
