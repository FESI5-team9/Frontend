import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const queryString = new URLSearchParams(searchParams).toString();
  const queryPrefix = queryString ? "?" : "";

  const accessToken = request.cookies.get("access-token")?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/by/${userId}${queryPrefix}${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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
