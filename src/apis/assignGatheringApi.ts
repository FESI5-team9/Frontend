import { getRegionMapping } from "@/hooks/useRegion";
import { CancelGatheringRes, CreateGathering, GatheringRes } from "@/types/api/gatheringApi";
import { DistrictName } from "@/types/hooks/region";
import fetchWithMiddleware from "./fetchWithMiddleware";

// 모임 취소
export async function CancelGathering(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/cancel`, {
    method: "PUT",
  });
  const data: CancelGatheringRes = await response.json();
  return data;
}

// 모임 생성
export async function createGathering(body: CreateGathering, image?: File) {
  const formData = new FormData();

  // body의 각 항목을 FormData에 추가
  Object.entries(body).forEach(([key, value]) => {
    if (key === "location" && value) {
      const mappedRegion = getRegionMapping(value as DistrictName);
      formData.append(key, mappedRegion);
    } else if (key === "keyword" && Array.isArray(value)) {
      value.forEach(item => formData.append(key, item));
    } else if (key === "image" && value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  if (image) {
    formData.append("image", image, image.name);
  }
  const response = await fetchWithMiddleware("/api/gatherings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  });
  if (!response.ok) {
    // HTTP 상태 코드가 200-299가 아닌 경우 에러 throw
    const errorData = await response.json();
    throw new Error(errorData.message || "모임 생성에 실패했습니다.");
  }
  const data: GatheringRes = await response.json();
  return data;
}

// 모임 참여
export async function joinGathering(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/join`, {
    method: "POST",
  });
  if (!response.ok) {
    // HTTP 상태 코드가 200-299가 아닌 경우 에러 throw
    const errorData = await response.json();
    throw new Error(errorData.message || "모임 참여에 실패했습니다.");
  }
  const data = await response.json();
  return data;
}

// 모임 참여 취소
export async function LeaveGathering(id: number) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/leave`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

// 모임 수정
export async function editGathering(id: number, body: FormData) {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}`, {
    method: "PUT",
    body,
  });
  const data: GatheringRes = await response.json();
  return data;
}

// 모임 상태 변경
export async function recruitGathering(id: number, status: "RECRUITING" | "RECRUITMENT_COMPLETED") {
  const response = await fetchWithMiddleware(`/api/gatherings/${id}/recruit?status=${status}`);
  const data = await response.json();
  return data;
}
