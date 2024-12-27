import useUserStore from "@/store/userStore";
import { Login, PostUsers, PutUsers, User } from "@/types/api/authApi";
import fetchWithMiddleware from "./fetchWithMiddleware";

// 회원가입
export async function signup(body: PostUsers): Promise<User> {
  const response = await fetchWithMiddleware("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data: User = await response.json();
  return data;
}

// 유저 정보 조회
export async function getUserProfile() {
  const response = await fetchWithMiddleware("/api/user");
  const data: User = await response.json();
  return data;
}

// 로그인
export async function signin(body: Login) {
  const response = await fetchWithMiddleware("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const { id, email, nickname, image } = await getUserProfile();

  const userStore = useUserStore.getState();
  userStore.setUser({
    id,
    email,
    nickname,
    image,
  });
  return response;
}

// 회원가입
export async function signout() {
  await fetch("/api/auth/signout", {
    method: "POST",
  });
}
// 유저 정보 수정
export async function updateUserProfile(body: PutUsers): Promise<User> {
  const formData = new FormData();
  if (body.nickname) formData.append("nickname", body.nickname);
  if (body.image) formData.append("image", body.image);

  const response = await fetchWithMiddleware("/api/user", {
    method: "PUT",
    body: formData,
  });

  const data: User = await response.json();

  const userStore = useUserStore.getState();
  userStore.setUser({
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    image: data.image,
  });

  return data;
}

// 이메일 검증
export async function checkEmail(email: string) {
  const response = await fetchWithMiddleware(`/api/auth/check-email?email=${email}`);
  return response.json() as Promise<{ message: string }>;
}

// 닉네임 검증
export async function checkNickName(nickname: string) {
  const response = await fetchWithMiddleware(`/api/auth/check-nickname?nickname=${nickname}`);
  return response.json() as Promise<{ message: string }>;
}

// 소셜 로그인
export async function socialSignup(social: string, code: string) {
  const response = await fetchWithMiddleware(`/api/auth/socialSignin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      social: social,
      code: code,
    }),
  });

  const { id, email, nickname, image } = await getUserProfile();

  const userStore = useUserStore.getState();
  userStore.setUser({
    id,
    email,
    nickname,
    image,
  });
  return response;
}
