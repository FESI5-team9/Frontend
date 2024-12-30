import {
  CancelGathering,
  LeaveGathering,
  createGathering,
  editGathering,
  joinGathering,
  recruitGathering,
} from "@/apis/assignGatheringApi";
import fetchWithMiddleware from "@/apis/fetchWithMiddleware";
import { CreateGathering, GatheringRes } from "@/types/api/gatheringApi";

jest.mock("@/apis/fetchWithMiddleware");

describe("assignGatheringApi 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGathering: GatheringRes = {
    id: 1,
    name: "Gathering 1",
    location: "SEOUL",
    address1: "Address 1",
    dateTime: new Date().toISOString(),
    participantCount: 10,
    capacity: 20,
    type: "CAFE",
    image: "image1.png",
    registrationEnd: new Date().toISOString(),
    address2: "Address 2",
    keyword: ["Keyword1", "Keyword2"],
    createdAt: new Date().toISOString(),
  };

  test("CancelGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await CancelGathering(1);

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1/cancel", {
      method: "PUT",
    });
  });

  test("createGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockGathering),
    });

    const body: CreateGathering = {
      name: "Gathering 1",
      location: "Location 1",
      address1: "Address 1",
      dateTime: new Date().toISOString(),
      openParticipantCount: 10,
      capacity: 20,
    };
    const result = await createGathering(body);

    expect(result).toEqual(mockGathering);
  });

  test("joinGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await joinGathering(1);

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1/join", {
      method: "POST",
    });
  });

  test("LeaveGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await LeaveGathering(1);

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/gatherings/1/leave", {
      method: "DELETE",
    });
  });

  test("editGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockGathering),
    });

    const body: CreateGathering = {
      name: "Updated Gathering",
      location: "Updated Location",
      address1: "Updated Address",
      dateTime: new Date().toISOString(),
      openParticipantCount: 15,
      capacity: 25,
    };
    const result = await editGathering(1, body);

    expect(result).toEqual(mockGathering);
  });

  test("recruitGathering 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await recruitGathering(1, "RECRUITMENT_COMPLETED");

    expect(result).toEqual({});
    expect(fetchWithMiddleware).toHaveBeenCalledWith(
      "/api/gatherings/1/recruit?status=RECRUITMENT_COMPLETED",
    );
  });
});
