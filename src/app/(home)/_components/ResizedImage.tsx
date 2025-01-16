import Image from "next/image";

interface ResizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number; // 이미지 품질 (기본값 75)
  format?: string; // 이미지 형식 (예: jpg, png)
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}

function getParametersForUnsplash({
  width,
  height,
  quality = 75,
  format = "jpg",
}: {
  width: number;
  height: number;
  quality?: number;
  format?: string;
}) {
  return `?w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop`;
}

export function ResizedImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  format = "jpg",
  placeholder = "empty",
  blurDataURL = "",
  priority = false,
  fetchPriority = "auto",
}: ResizedImageProps) {
  const optimizedSrc =
    src && src.trim() !== ""
      ? `${src}${getParametersForUnsplash({ width, height, quality, format })}`
      : "/images/default-gathering.jpg";

  const optimizedBlurDataURL =
    blurDataURL ||
    `${optimizedSrc}${getParametersForUnsplash({
      width: 10,
      height: 10,
      quality: 1,
      format: "jpg",
    })}`; // Blur용 낮은 품질 이미지

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 272px, 272px"
      fetchPriority={fetchPriority}
      placeholder={placeholder}
      blurDataURL={optimizedBlurDataURL}
      className="h-auto max-h-full w-full max-w-full rounded-2xl object-cover tablet:h-[153px] tablet:w-[272px] tablet:rounded-l-2xl"
    />
  );
}
