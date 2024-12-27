import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Gnb from "@/components/Gnb";

function SignRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = cookieStore.get("access-token");

  if (token) {
    redirect("/");
  }

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDRICT_URL}&response_type=code`;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDRICT_URL}&response_type=code&scope=email profile openid`;

  return (
    <div className="relative min-h-screen w-full bg-white">
      <Gnb />
      <div className="mx-auto flex h-full min-h-screen w-full flex-col items-center justify-center gap-12 px-4 py-10 pt-[32px] tablet:px-[75px] desktop:flex-row desktop:px-4">
        <div className="text-medium flex flex-col gap-4 text-center">
          <Link href="/" scroll>
            <Image
              src="/images/img_login.png"
              width={225}
              height={150}
              className="w-[225px] tablet:w-[240px] desktop:w-[300px]"
              alt="메인로고"
            />
          </Link>
          <p>
            나만 알고싶은 맛집
            <br />
            이제는 MNM에서 함께나눠요
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white px-4 py-8 shadow-[0_0_15px_0_rgba(0,0,0,0.05),0_-4px_15px_0_rgba(0,0,0,0.05)] tablet:px-[54px] desktop:w-[510px] desktop:px-[54px]">
          {children}
          <div className="flex justify-center gap-4">
            <Link
              href={GOOGLE_AUTH_URL}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300"
            >
              <Image
                src="/icons/Ic-Google.svg"
                width={48}
                height={48}
                alt="Google 아이콘"
                draggable={false}
              />
            </Link>
            <Link
              href={KAKAO_AUTH_URL}
              className="flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Image
                src="/icons/Ic-Kakao.svg"
                width={48}
                height={48}
                alt="카카오톡 아이콘"
                draggable={false}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignRootLayout;
