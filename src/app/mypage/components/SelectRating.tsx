import React, { useState } from "react";
import Heart from "@/app/mypage/components/Heart";

type SelectRatingProps = {
  onChange: (score: number) => void;
};

const SelectRating = ({ onChange }: SelectRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHovered(index);
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  const handleClick = (index: number) => {
    setSelected(index);
    onChange(index);
  };

  return (
    <div className="flex h-6 w-full gap-0.5">
      {[1, 2, 3, 4, 5].map(index => (
        <span
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          className="flex cursor-pointer items-center justify-center"
        >
          <Heart
            size={24}
            filled={hovered !== null ? index <= hovered : index <= (selected || 0)}
          />
        </span>
      ))}
    </div>
  );
};

export default SelectRating;
