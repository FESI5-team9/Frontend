"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socialSignup } from "@/apis/authApi";

function KakaoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        await socialSignup("kakao", code);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    handleKakaoLogin();
  }, [router]);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center">
      <Image
        src="/images/img_login.png"
        width={400}
        height={400}
        alt="로고 이미지"
        className="animate-[bounce_0.7s_ease-in-out_infinite]"
      />
    </div>
  );
}

export default KakaoRedirect;
