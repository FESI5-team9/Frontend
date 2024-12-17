import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const queryString = new URLSearchParams(params).toString();
  const queryPrefix = queryString ? "?" : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/favorite${queryPrefix}${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.cookies.get("access-token")?.value}`,
      },
    },
  );

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } else {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  }
}
