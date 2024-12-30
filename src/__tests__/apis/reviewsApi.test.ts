import fetchWithMiddleware from "@/apis/fetchWithMiddleware";
import { addReviews, getReviewStats, getReviews, getReviewsRating } from "@/apis/reviewsApi";
import {
  AddReviews,
  AddReviewsRes,
  GetReviewStatsRes,
  GetReviewsRatingRes,
  ReviewsRes,
} from "@/types/api/reviews";

jest.mock("@/apis/fetchWithMiddleware");

describe("reviewsApi 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReview: ReviewsRes = [
    {
      id: 1,
      score: 4,
      comment: "정말 좋은 모임이었습니다!",
      createdAt: "2024-12-30T10:00:00.000Z",
      gathering: {
        id: 1,
        type: "CAFE",
        name: "강남 카페 모임",
        location: "SEOUL",
        image: "cafe-meeting.jpg",
        dateTime: "2024-12-29T14:00:00.000Z",
      },
      user: {
        id: 1,
        nickname: "테스트유저",
        image: "user-profile.jpg",
      },
    },
    {
      id: 2,
      score: 5,
      comment: "다음에도 참여하고 싶은 모임입니다",
      createdAt: "2024-12-30T11:00:00.000Z",
      gathering: {
        id: 2,
        type: "RESTAURANT",
        name: "맛집 탐방",
        location: "GANGWON_DO",
        image: "restaurant-meeting.jpg",
        dateTime: "2024-12-29T18:00:00.000Z",
      },
      user: {
        id: 2,
        nickname: "맛집러버",
        image: "foodie-profile.jpg",
      },
    },
  ];

  const mockAddReview: AddReviewsRes = [
    {
      id: 1,
      userId: 1,
      gatheringId: 1,
      comment: "Great gathering!",
      score: 5,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockReviewsRating: GetReviewsRatingRes = [
    {
      gatheringId: 1,
      type: "CAFE",
      averageScore: 3,
      oneStar: 1,
      twoStars: 1,
      threeStars: 1,
      fourStars: 1,
      fiveStars: 1,
    },
  ];

  const mockReviewStats: GetReviewStatsRes = {
    averageScore: 3,
    oneStar: 1,
    twoStars: 1,
    threeStars: 1,
    fourStars: 1,
    fiveStars: 1,
  };

  test("getReviews 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockReview),
    });

    const result = await getReviews();

    expect(result).toEqual(mockReview);
  });

  test("addReviews 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAddReview),
    });

    const body: AddReviews = {
      gatheringId: 1,
      score: 5,
      comment: "Great gathering!",
    };
    const result = await addReviews(body);

    expect(result).toEqual(mockAddReview);
  });

  test("getReviewsRating 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockReviewsRating),
    });

    const result = await getReviewsRating();

    expect(result).toEqual(mockReviewsRating);
  });

  test("getReviewStats 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockReviewStats),
    });

    const result = await getReviewStats("gathering");

    expect(result).toEqual(mockReviewStats);
  });
});
