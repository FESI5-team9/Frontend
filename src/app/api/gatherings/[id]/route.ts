import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = request.cookies.get("access-token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/${params.id}`, {
    method: "GET",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } else {
    const errorData = await response.json();
    return NextResponse.json(errorData, { status: response.status });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const accessToken = request.cookies.get("access-token")?.value;
  const body = await request.formData();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/gatherings/${params.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
