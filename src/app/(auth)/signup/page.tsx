"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkEmail, checkNickName, signup } from "@/apis/authApi";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PopupComponent from "@/app/(auth)/_components/PopupComponent";
import baseSchema from "@/utils/schema";

function Signup() {
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [nicknameVerified, setNicknameVerified] = useState<boolean | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<string | null>(null);
  type LoginFormData = z.infer<typeof baseSchema>;
  const loginSchema = baseSchema
    .pick({
      email: true,
      password: true,
      nickname: true,
      confirmPassword: true,
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "비밀번호가 일치하지 않습니다.",
      path: ["confirmPassword"],
    })
    .superRefine((data, ctx) => {
      if (data.email && emailVerified === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "사용할 수 없는 이메일입니다.",
          path: ["email"],
        });
      } else if (data.email && emailVerified === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "이메일 중복 확인이 필요합니다.",
          path: ["email"],
        });
      }

      if (data.nickname && nicknameVerified === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "동일한 닉네임이 존재합니다.",
          path: ["nickname"],
        });
      } else if (data.nickname && nicknameVerified === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "닉네임 중복 확인이 필요합니다.",
          path: ["nickname"],
        });
      }
      return true;
    });

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signup(data);
      router.push("/");
    } catch (error) {
      setIsPopupOpen("signup-failed");
    }
  };

  useEffect(() => {
    if (emailVerified !== null) {
      trigger("email");
    }
  }, [emailVerified, trigger]);

  useEffect(() => {
    if (nicknameVerified !== null) {
      trigger("nickname");
    }
  }, [nicknameVerified, trigger]);

  const onCheckEmail = async () => {
    const email = getValues("email");
    const { message } = await checkEmail(email);

    if (message === "true") {
      setEmailVerified(false);
      setIsPopupOpen("email-exists");
    } else {
      setEmailVerified(true);
      setIsPopupOpen("email-ok");
    }
  };

  const onCheckNickname = async () => {
    const nickname = getValues("nickname");
    const { message } = await checkNickName(nickname);

    if (message === "true") {
      setNicknameVerified(false);
      setIsPopupOpen("nickname-exists");
    } else {
      setNicknameVerified(true);
      setIsPopupOpen("nickname-ok");
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <h1 className="text-center text-xl">회원가입 </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex w-full flex-col gap-[28px]">
        <div className="relative flex w-full gap-3">
          <div className="flex-1">
            <Input
              register={register("nickname")}
              type="text"
              name="nickname"
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              error={errors.nickname}
            />
          </div>
          <Button
            type="button"
            onClick={onCheckNickname}
            className="mt-7"
            size="small"
            bgColor="yellow"
          >
            중복 확인
          </Button>
        </div>
        <div className="relative flex w-full gap-3">
          <div className="flex-1">
            <Input
              register={register("email")}
              type="email"
              name="email"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              error={errors.email}
            />
          </div>
          <Button
            type="button"
            onClick={onCheckEmail}
            className="mt-7"
            size="small"
            bgColor="yellow"
          >
            중복 확인
          </Button>
        </div>
        <Input
          register={register("password")}
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password}
        />
        <Input
          register={register("confirmPassword")}
          type="password"
          name="confirmPassword"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 한 번 입력해주세요"
          error={errors.confirmPassword}
        />
        <Button type={isValid ? "submit" : "button"} bgColor={isValid ? "yellow" : "disabled"}>
          회원가입하기
        </Button>
        <div className="-mt-1 text-center">
          이미 회원이신가요?{" "}
          <Link href="/signin" scroll>
            <span className="text-orange-300 underline">로그인</span>
          </Link>
        </div>
      </form>
      <div className="flex w-full items-center justify-between gap-4 text-center text-gray-500">
        <hr className="flex-1 border-gray-200 desktop:w-20" />
        <span className="w-[160px] text-sm text-gray-300">SNS 계정으로 회원가입하기</span>
        <hr className="flex-1 border-gray-200 desktop:w-20" />
      </div>
      <PopupComponent
        id="email-exists"
        message="이메일이 존재합니다."
        isOpen={isPopupOpen === "email-exists"}
        onClose={() => setIsPopupOpen(null)}
      />
      <PopupComponent
        id="nickname-exists"
        message="닉네임이 이미 존재합니다."
        isOpen={isPopupOpen === "nickname-exists"}
        onClose={() => setIsPopupOpen(null)}
      />
      <PopupComponent
        id="signup-failed"
        message="회원가입에 실패했습니다."
        isOpen={isPopupOpen === "signup-failed"}
        onClose={() => setIsPopupOpen(null)}
      />
      <PopupComponent
        id="nickname-ok"
        message="사용 가능한 닉네임 입니다."
        isOpen={isPopupOpen === "nickname-ok"}
        onClose={() => setIsPopupOpen(null)}
      />
      <PopupComponent
        id="email-ok"
        message="사용 가능한 이메일입니다."
        isOpen={isPopupOpen === "email-ok"}
        onClose={() => setIsPopupOpen(null)}
      />
    </div>
  );
}

export default Signup;
