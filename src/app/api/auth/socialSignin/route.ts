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
  const code = signInData.code;
  const encodedCode = encodeURIComponent(code);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signin/${signInData.social}?code=${encodedCode}`,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const social = searchParams.get("social");
    const code = searchParams.get("code");

    if (!social || !code) {
      return NextResponse.json({ message: "잘못된 요청" }, { status: 400 });
    }

    const requestBody: SignInRequestBody = { social, code };
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
    console.error(":", error);
    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
}
