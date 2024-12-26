import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 쿼리 파라미터에서 닉네임 추출
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get("nickname");

  if (!nickname) {
    return NextResponse.json({ message: "닉네임이 제공되지 않았습니다." }, { status: 400 });
  }

  // 외부 API 호출
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/check-nickname?nickname=${nickname}`,
  );

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } else {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  }
}
