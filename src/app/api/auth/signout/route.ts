import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");

  return new Response("Logged out", { status: 200 });
}
