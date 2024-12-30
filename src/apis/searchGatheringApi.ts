import buildQueryParams from "@/hooks/queryParams";
import {
  GatheringDetailRes,
  Gatherings,
  GatheringsRes,
  GetGatheringParticipants,
  GetGatheringParticipantsRes,
  GetMyJoinedGatherings,
  GetMyJoinedGatheringsRes,
  GetSearchGatheringRes,
  GetSearchGatherings,
  GetUserGatheringParticipants,
  GetUserGatheringParticipantsRes,
} from "@/types/api/gatheringApi";
import fetchWithMiddleware from "./fetchWithMiddleware";

// 모임 목록 조회
export async function getGatherings(params: Gatherings) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }
  const response = await fetchWithMiddleware(`/api/gatherings?${searchParams.toString()}`);
  const data: GatheringsRes = await response.json();
  return data;
}

// 모임 상세 조회
export async function getGatheringDetail(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}`);
  const data: GatheringDetailRes = await response.json();
  return data;
}

// 특정 모임의 참가자 목록 조회
export async function getGatheringParticipants(id: number, params: GetGatheringParticipants) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }
  const response = await fetchWithMiddleware(
    `/api/gatherings/${id}/participants?${searchParams.toString()}`,
  );
  const data: GetGatheringParticipantsRes = await response.json();
  return data;
}

// 모임 목록 검색
export async function getSearchGatherings(params: GetSearchGatherings) {
  const formatSearchKeywords = (searchText: string): string => {
    return searchText
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .filter(word => word.length > 0)
      .join(",");
  };

  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", formatSearchKeywords(params.search));
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "search") {
      searchParams.set(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const response = await fetchWithMiddleware(
    `/api/gatherings/search${queryString ? `?${queryString}` : ""}`,
  );

  const data: GetSearchGatheringRes = await response.json();
  return data;
}

// 로그인된 사용자가 참석한 모임 목록 조회
export async function getMyJoinedGatherings(params: GetMyJoinedGatherings) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }
  const response = await fetchWithMiddleware(`/api/gatherings/joined?${searchParams.toString()}`);
  const data: GetMyJoinedGatheringsRes = await response.json();
  return data;
}

// 사용자가 생성한 모임 조회
export async function getUserGathering(userId: string, params: GetUserGatheringParticipants) {
  const searchParams = new URLSearchParams();
  if (params) {
    buildQueryParams(searchParams, params);
  }
  const response = await fetchWithMiddleware(
    `/api/gatherings/by/${userId}?${searchParams.toString()}`,
  );
  const data: GetUserGatheringParticipantsRes = await response.json();
  return data;
}
