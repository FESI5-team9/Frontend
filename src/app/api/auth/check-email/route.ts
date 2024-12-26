import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 쿼리 파라미터에서 이메일 추출
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "이메일이 제공되지 않았습니다." }, { status: 400 });
  }

  // 외부 API 호출
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/check-email?email=${email}`,
  );

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } else {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  }
}
