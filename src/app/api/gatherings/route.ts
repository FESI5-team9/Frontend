import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;

  const url = new URL(request.url);
  const params = url.searchParams;

  const queryString = new URLSearchParams(params).toString();
  const queryPrefix = queryString ? "?" : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/gatherings${queryPrefix}${queryString}`,
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
