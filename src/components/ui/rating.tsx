"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils"

export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: RatingValue;
  onChange?: (value: RatingValue) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  labels?: Record<RatingValue, string>;
  color?: string;
}

export function Rating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showLabel = true,
  labels = {
    0: "Chưa đánh giá",
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Rất tốt",
  },
  color = "#FFD700", // Màu vàng mặc định cho sao
  className,
  ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<RatingValue | null>(null);

  // Kích thước sao dựa trên prop size
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // Kích thước font chữ cho label
  const labelSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Khoảng cách giữa các sao
  const gapSizes = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  // Xử lý khi click vào sao
  const handleClick = (newValue: RatingValue) => {
    if (readonly) return;
    onChange?.(newValue);
  };

  // Xử lý khi hover vào sao
  const handleMouseEnter = (newValue: RatingValue) => {
    if (readonly) return;
    setHoverValue(newValue);
  };

  // Xử lý khi rời chuột khỏi sao
  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  // Giá trị hiển thị (ưu tiên giá trị hover nếu có)
  const displayValue = hoverValue !== null ? hoverValue : value;

  // Label tương ứng với giá trị hiển thị
  const currentLabel = labels[displayValue];

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div
        className={cn("flex items-center", gapSizes[size])}
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSizes[size],
              "cursor-default transition-all",
              !readonly && "cursor-pointer",
              {
                "fill-current text-current": star <= displayValue,
              }
            )}
            style={{
              color: star <= displayValue ? color : "currentColor",
              opacity: star <= displayValue ? 1 : 0.3,
            }}
            onClick={() => handleClick(star as RatingValue)}
            onMouseEnter={() => handleMouseEnter(star as RatingValue)}
          />
        ))}
      </div>

      {showLabel && currentLabel && (
        <span className={cn("ml-2 text-muted-foreground", labelSizes[size])}>
          {currentLabel}
        </span>
      )}
    </div>
  );
}
