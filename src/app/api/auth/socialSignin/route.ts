import { NextRequest, NextResponse } from "next/server";

interface SignInRequestBody {
  social: string;
  code: string;
}

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

async function getTokensFromSigninApi(signInData: SignInRequestBody) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin/${signInData.social}?code=${signInData.code}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("로그인 요청 실패");
  }

  const TokenResponse: SignInResponse = await response.json();

  return {
    refreshToken: TokenResponse.refreshToken,
    accessToken: TokenResponse.accessToken,
  };
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: SignInRequestBody = await request.json();
    const { refreshToken, accessToken } = await getTokensFromSigninApi(requestBody);

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("refresh-token", refreshToken, {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    response.cookies.set("access-token", accessToken, {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 30, // 30분
    });

    return response;
  } catch (error) {
    console.error("로그인 요청 실패:", error); // 콘솔 로그 사용
    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
}
