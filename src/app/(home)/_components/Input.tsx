import React, { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number | undefined;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 선택적으로 수정
  className?: string; // 사용자 정의 클래스
  readonly?: boolean; // 불리언 타입
}

export const Input = forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
  const { value, name, onChange, className = "", readonly = false, ...rest } = props;
  return (
    <input
      ref={ref} // ref 전달
      value={value}
      name={name}
      readOnly={readonly} // 동적으로 적용
      onChange={onChange}
      className={`rounded-lg border border-gray-100 bg-gray-100 px-2 py-2 ${className} focus:border-yellow-400 focus:outline-none`}
      {...rest} // 추가 속성 처리
    />
  );
});

Input.displayName = "Input";
