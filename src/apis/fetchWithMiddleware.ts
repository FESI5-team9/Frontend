export default async function fetchWithMiddleware(url: string, options: RequestInit = {}) {
  try {
    // 첫 번째 요청 시도
    const response = await fetch(url, options);

    // 401 에러가 아니면 바로 반환
    if (response.status !== 401) {
      return response;
    }

    // Refresh 토큰으로 새 Access 토큰 요청
    const refreshResponse = await fetch("/api/auth/managed-access-token", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      // refresh 실패시 로그인 페이지로
      window.location.href = "/";
      throw new Error("Token refresh failed");
    }

    const { accessToken } = await refreshResponse.json();

    // 새로운 access token으로 원래 요청 재시도
    const newResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return newResponse;
  } catch (error) {
    throw error;
  }
}
