import { Suspense } from "react";
import { Metadata } from "next";
import FilterSection from "./_components/FilterSection";
import GatheringClient from "./_components/GatheringClient";
import HeroSection from "./_components/HeroSection";
import SelectedType from "./_components/SelectedType";
import SKGatheringPage from "./_components/Skeleton/SKGatheringPage";

type Props = {
  searchParams: { search?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const searchTerm = searchParams.search;

  if (searchTerm) {
    return {
      title: `${searchTerm} - 검색결과`,
      description: `${searchTerm} 맛집 검색결과 보러가기`,
      openGraph: {
        title: `${searchTerm} - 검색결과`,
        description: `${searchTerm} 맛집 검색결과 보러가기`,
        type: "website",
        url: `/?search=${searchTerm}`,
      },
    };
  }
  return {
    title: "MealAndMate",
    description: "Meal And Mate 에서 여러분의 맛집을 공유해보요!",
    openGraph: {
      title: "MealAndMate",
      description: "Meal And Mate 에서 여러분의 맛집을 공유해보요!",
      type: "website",
      url: "/",
    },
  };
}

export default async function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col px-2 py-[59px] tablet:w-[744px] tablet:justify-start tablet:px-1.5 desktop:w-[1200px] desktop:px-0">
      <HeroSection />
      <Suspense fallback={<SKGatheringPage />}>
        <SelectedType />
        <FilterSection />
        <GatheringClient />
      </Suspense>
    </main>
  );
}
