import type { Metadata } from "next";
import localFont from "next/font/local";
import Gnb from "@/components/Gnb";
import "./globals.css";
import ReactQueryProviders from "./providers";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.ttf",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "먹킷리스트",
  description: "먹킷리스트",
  referrer: "no-referrer-when-downgrade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} pt-[60px]`}>
        <Gnb />
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
