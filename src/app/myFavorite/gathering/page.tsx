import { Suspense } from "react";
import FilterSection from "@/app/(home)/_components/FilterSection";
import HeroSection from "@/app/(home)/_components/HeroSection";
import SelectedType from "@/app/(home)/_components/SelectedType";
import SKCardList from "@/app/(home)/_components/Skeleton/SKCardList";
import FavoriteGathClient from "./_components/FavoriteGathClient";

function page() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col px-2 py-[59px] tablet:w-[744px] tablet:justify-start tablet:px-1.5 desktop:w-[1200px] desktop:px-0">
      <HeroSection />
      <Suspense fallback={<SKCardList />}>
        <SelectedType />
        <FilterSection />
        <FavoriteGathClient />
      </Suspense>
    </main>
  );
}

export default page;
