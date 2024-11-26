"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "@/components/Input/Input";
import baseSchema from "@/utils/schema";

type LoginFormData = z.infer<typeof baseSchema>;

const loginSchema = baseSchema
  .pick({ name: true, email: true, nickname: true, password: true, confirmPassword: true })
  .refine(data => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

function SignIn() {
  const {
    register,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  return (
    <form className="mx-auto flex max-w-[600px] flex-col gap-6 px-10 pt-20">
      <Input
        register={register("name")}
        type="text"
        name="name"
        label="이름"
        placeholder="이름을 입력해주세요"
        error={errors.name}
        touched={touchedFields.name}
      />
      <Input
        register={register("email")}
        type="email"
        name="email"
        label="이메일"
        placeholder="이메일을 입력해주세요"
        error={errors.email}
        touched={touchedFields.email}
      />
      <Input
        register={register("nickname")}
        type="text"
        name="nickname"
        label="닉네임"
        placeholder="닉네임을 입력해주세요"
        error={errors.nickname}
        touched={touchedFields.nickname}
      />
      <Input
        register={register("password")}
        type="password"
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        error={errors.password}
        touched={touchedFields.password}
      />
      <Input
        register={register("confirmPassword")}
        type="password"
        name="confirmPassword"
        label="비밀번호 확인"
        placeholder="비밀번호를 한번 더 입력해주세요"
        error={errors.confirmPassword}
        touched={touchedFields.confirmPassword}
      />
    </form>
  );
}

export default SignIn;