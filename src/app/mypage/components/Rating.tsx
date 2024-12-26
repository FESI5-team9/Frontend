import React from "react";
import Heart from "@/app/mypage/components/Heart";
import { RatingProps } from "@/types/components/heart";

const Rating = ({ score }: RatingProps) => {
  // 1부터 5까지의 하트를 만들기 위한 배열
  const hearts = [];
  for (let i = 1; i <= 5; i++) {
    hearts.push(
      <Heart
        key={i}
        size={20}
        filled={i <= score} // score보다 작거나 같으면 채워진 하트, 아니면 빈 하트
      />,
    );
  }

  return <div className="flex h-6 w-full gap-0.5">{hearts}</div>;
};

export default Rating;
