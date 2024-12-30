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
