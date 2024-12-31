import {
  deleteFavoriteGathering,
  getFavoriteGathering,
  getFavoriteGatherings,
} from "@/apis/favoriteGatheringApi";
import fetchWithMiddleware from "@/apis/fetchWithMiddleware";

interface GatheringFavorite {
  id: number;
  name: string;
  location: string;
  address1: string;
  dateTime: string;
  participantCount: number;
  capacity: number;
  status: string;
  image: string;
  open: boolean;
  favorite: boolean;
  participation: boolean;
}

export interface GatheringsFavoriteRes {
  gatherings: GatheringFavorite[];
  total: number;
}

jest.mock("@/apis/fetchWithMiddleware");

describe("favoriteGatheringApi 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGathering: GatheringsFavoriteRes = {
    gatherings: [
      {
        id: 1,
        name: "Gathering 1",
        location: "Location 1",
        address1: "Address 1",
        dateTime: "2023-10-10T10:00:00.000Z",
        participantCount: 10,
        capacity: 20,
        status: "RECRUITMENT_COMPLETED",
        image: "image1.png",
        open: true,
        favorite: true,
        participation: true,
      },
    ],
    total: 1,
  };

  test("getFavoriteGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await getFavoriteGathering(1);

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1/favorite", {
      method: "POST",
    });
  });

  test("deleteFavoriteGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await deleteFavoriteGathering(1);

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1/favorite", {
      method: "DELETE",
    });
  });

  test("getFavoriteGatherings 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockGathering),
    });

    const params = {
      size: 10,
      page: 0,
      sort: "dateTime",
      direction: "desc" as const,
    };
    const result = await getFavoriteGatherings(params);

    expect(result).toEqual(mockGathering);
    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/favorite?size=10&page=0&sort=dateTime&direction=desc",
    );
  });
});
