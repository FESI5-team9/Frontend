import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;

  const url = new URL(request.url);
  const params = url.searchParams;

  // 쿼리 스트링 생성 및 디버깅
  const queryString = params.toString();
  const searchValue = params.get("search");

  // 디코딩 처리
  const decodedSearchValue = searchValue ? decodeURIComponent(searchValue) : null;

  // API URL 생성
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  let apiUrl: string;

  if (decodedSearchValue) {
    // search 값이 있을 경우
    apiUrl = `${apiBaseUrl}/gatherings/search?search=${encodeURIComponent(decodedSearchValue)}&${queryString}`;
  } else {
    // search 값이 없을 경우
    apiUrl = `${apiBaseUrl}/gatherings?${queryString}`;
  }

  try {
    // API 요청
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const errorData = await response.json();
      console.error("API 요청 실패:", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }
  } catch (error) {
    console.error("API 요청 중 오류:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const accessToken = request.cookies.get("access-token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/gatherings`, {
    method: "POST",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body,
  });

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } else {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  }
}
