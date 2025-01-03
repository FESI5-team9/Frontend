import {
  checkEmail,
  checkNickName,
  getUserProfile,
  signin,
  signout,
  signup,
  updateUserProfile,
} from "@/apis/authApi";
import fetchWithMiddleware from "@/apis/fetchWithMiddleware";
import useUserStore from "@/store/userStore";
import { Login, PostUsers, PutUsers, User } from "@/types/api/authApi";

jest.mock("@/apis/fetchWithMiddleware");
jest.mock("@/store/userStore");

describe("authApi 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    nickname: "testuser",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test("signup 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUser),
    });

    const body: PostUsers = {
      email: "test@example.com",
      password: "password",
      nickname: "testuser",
    };
    const result = await signup(body);

    expect(result).toEqual(mockUser);
  });

  test("getUserProfile 성공 케이스", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockUser),
    };
    (fetchWithMiddleware as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getUserProfile();
    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/user");
    expect(result).toEqual(mockUser);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  test("signin 성공 케이스", async () => {
    // signin 응답 모킹
    const mockSigninResponse = { json: () => Promise.resolve({}) };
    (fetchWithMiddleware as jest.Mock).mockResolvedValue(mockSigninResponse);

    // getUserProfile 응답 모킹
    const mockProfileResponse = { json: () => Promise.resolve(mockUser) };
    (fetchWithMiddleware as jest.Mock)
      .mockResolvedValueOnce(mockSigninResponse) // 첫 번째 호출 (signin)
      .mockResolvedValueOnce(mockProfileResponse); // 두 번째 호출 (getUserProfile)

    const setUser = jest.fn();
    (useUserStore.getState as jest.Mock).mockReturnValue({ setUser });

    const body: Login = { email: "test@example.com", password: "password" };
    await signin(body);

    expect(setUser).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockUser.email,
      nickname: mockUser.nickname,
      image: mockUser.image,
    });
  });

  test("signout 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    await signout();

    expect(fetchWithMiddleware).toHaveBeenCalledWith("/api/auth/signout", {
      method: "POST",
    });
  });

  test("updateUserProfile 성공 케이스", async () => {
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUser),
    });
    const setUser = jest.fn();
    (useUserStore.getState as jest.Mock).mockReturnValue({ setUser });

    const body: PutUsers = { nickname: "newnickname" };
    const result = await updateUserProfile(body);

    expect(result).toEqual(mockUser);
    expect(setUser).toHaveBeenCalledWith({
      id: mockUser.id,
      email: mockUser.email,
      nickname: mockUser.nickname,
      image: mockUser.image,
    });
  });

  test("checkEmail 성공 케이스", async () => {
    const message = { message: "사용 가능한 이메일입니다." };
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(message),
    });

    const result = await checkEmail("test@example.com");

    expect(result).toEqual(message);
  });

  test("checkNickName 성공 케이스", async () => {
    const message = { message: "사용 가능한 닉네임입니다." };
    (fetchWithMiddleware as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(message),
    });

    const result = await checkNickName("testuser");

    expect(result).toEqual(message);
  });
});
