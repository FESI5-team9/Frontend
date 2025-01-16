/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_AMAZON_S3, // S3 도메인을 환경 변수에서 가져옵니다.
        pathname: "/**", // 모든 경로 허용
      },
    ],
    // unoptimized: true, // Next.js의 이미지 최적화 비활성화
  },
  async headers() {
    return [
      {
        source: "/_next/image(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
