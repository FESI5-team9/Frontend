import FilterSection from "../../_components/FilterSection";
import GatheringClient from "../../_components/GatheringClient";
import HeroSection from "../../_components/HeroSection";
import SelectedType from "../../_components/SelectedType";

export default async function page() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col px-2 py-[59px] tablet:w-[744px] tablet:justify-start tablet:px-1.5 desktop:w-[1200px] desktop:px-0">
      <HeroSection />
      <SelectedType />
      <FilterSection />
      <GatheringClient />
    </main>
  );
}
