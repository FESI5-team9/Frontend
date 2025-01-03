import fetchWithMiddleware from "@/apis/fetchWithMiddleware";
import {
  getGatheringDetail,
  getGatheringParticipants,
  getGatherings,
  getMyJoinedGatherings,
  getSearchGatherings,
  getUserGathering,
} from "@/apis/searchGatheringApi";

jest.mock("@/apis/fetchWithMiddleware");

describe("searchGatheringApi 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGathering = {
    id: 1,
    name: "테스트 모임",
    type: "CAFE",
    location: "SEOUL",
    address1: "강남구",
    dateTime: "2024-12-30T10:00:00.000Z",
    participantCount: 5,
    capacity: 10,
    status: "RECRUITING",
    image: "test.jpg",
    open: true,
    favorite: false,
    participation: false,
  };

  const mockDetailGathering = {
    ...mockGathering,
    description: "모임 설명입니다.",
    keyword: ["친목", "소통"],
    openParticipantCount: 3,
    address2: "상세주소",
    registrationEnd: "2024-12-29T10:00:00.000Z",
    createdAt: "2024-12-20T10:00:00.000Z",
    canceledAt: "",
    user: {
      id: 1,
      nickname: "테스트유저",
      image: "profile.jpg",
    },
    host: false,
    participants: [
      {
        gatheringId: 1,
        joinedAt: "2024-12-21T10:00:00.000Z",
        userId: 2,
        email: "test@test.com",
        nickname: "참가자1",
        image: "participant.jpg",
      },
    ],
  };

  test("getGatherings 성공 케이스", async () => {
    const mockResponse = [mockGathering];
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getGatherings({
      type: "CAFE",
      location: "SEOUL",
      size: 10,
      page: 0,
    });

    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings?type=CAFE&location=SEOUL&size=10&page=0",
    );
    expect(result).toEqual(mockResponse);
  });

  test("getGatheringDetail 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDetailGathering),
    });

    const result = await getGatheringDetail(1);

    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1");
    expect(result).toEqual(mockDetailGathering);
  });

  test("getGatheringParticipants 성공 케이스", async () => {
    const mockParticipants = [mockDetailGathering.participants[0]];
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockParticipants),
    });

    const params = {
      size: 10,
      page: 0,
    };
    const result = await getGatheringParticipants(1, params);

    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/1/participants?size=10&page=0",
    );
    expect(result).toEqual(mockParticipants);
  });

  test("getSearchGatherings 성공 케이스", async () => {
    const mockSearchResponse = [mockGathering];
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockSearchResponse),
    });

    const result = await getSearchGatherings({
      search: "테스트 모임",
      type: "CAFE",
      location: "SEOUL",
    });

    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/search?search=테스트,모임&type=CAFE&location=SEOUL",
    );
    expect(result).toEqual(mockSearchResponse);
  });

  test("getMyJoinedGatherings 성공 케이스", async () => {
    const mockJoinedGathering = {
      ...mockGathering,
      joinedAt: "2024-12-21T10:00:00.000Z",
      isCompleted: false,
      isReviewed: false,
    };
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([mockJoinedGathering]),
    });

    const params = {
      completed: false,
      reviewed: false,
      size: 10,
      page: 0,
    };
    const result = await getMyJoinedGatherings(params);

    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/joined?completed=false&reviewed=false&size=10&page=0",
    );
    expect(result).toEqual([mockJoinedGathering]);
  });

  test("getUserGathering 성공 케이스", async () => {
    const mockUserGatherings = [mockGathering];
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUserGatherings),
    });

    const params = {
      size: 10,
      page: 0,
      sort: "dateTime",
      direction: "desc" as const,
    };
    const result = await getUserGathering({ userId: 1, ...params });

    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/by/1?size=10&page=0&sort=dateTime&direction=desc",
    );
    expect(result).toEqual(mockUserGatherings);
  });
});
