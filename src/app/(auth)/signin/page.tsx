"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signin } from "@/apis/authApi";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PopupComponent from "@/app/(auth)/_components/PopupComponent";
import { Login } from "@/types/api/authApi";
import baseSchema from "@/utils/schema";

type LoginFormData = z.infer<typeof baseSchema>;
const loginSchema = baseSchema.pick({ email: true, password: true });

function LoginPage() {
  const [isPopupOpen, setIsPopupOpen] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });
  const router = useRouter();

  const onSubmit = async (data: Login) => {
    const response = await signin(data);

    if (response.ok) {
      const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
      router.push(redirectTo);
      router.refresh();
    } else {
      setIsPopupOpen("login-failed");
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <h1 className="text-center text-xl">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex w-full flex-col gap-[28px]">
        <Input
          register={register("email")}
          type="email"
          name="email"
          label="이메일"
          placeholder="이메일을 입력해주세요"
          error={errors.email}
        />
        <Input
          register={register("password")}
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password}
        />
        <Button type={isValid ? "submit" : "button"} bgColor={isValid ? "yellow" : "disabled"}>
          로그인하기
        </Button>

        <div className="-mt-1 text-center">
          회원이 아니신가요?{" "}
          <Link href="/signup" scroll>
            <span className="text-orange-300 underline">회원가입</span>
          </Link>
        </div>
      </form>
      <div className="flex w-full items-center justify-between gap-4 text-center text-gray-500">
        <hr className="flex-1 border-gray-200 desktop:w-20" />
        <span className="w-[145px] text-sm text-gray-300">SNS 계정으로 로그인하기</span>
        <hr className="flex-1 border-gray-200 desktop:w-20" />
      </div>
      <PopupComponent
        id="login-failed"
        message="아이디 혹은 비밀번호를 확인해주세요"
        isOpen={isPopupOpen === "login-failed"}
        onClose={() => setIsPopupOpen(null)}
      />
    </div>
  );
}

export default LoginPage;
