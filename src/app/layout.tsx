import type { Metadata } from "next";
import localFont from "next/font/local";
import Gnb from "@/components/Gnb";
import GoogleAnalytics from "@/lib/GoogleAnalytics";
import "./globals.css";
import ReactQueryProviders from "./providers";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.ttf",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MealAndMate",
  description: "Meal And Mate 에서 여러분의 맛집을 공유해봐요!",
  icons: {
    icon: "@/app/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} pt-[60px]`}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        <ReactQueryProviders>
          <Gnb />
          {children}
        </ReactQueryProviders>
      </body>
    </html>
  );
}
