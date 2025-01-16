import SKCard from "./SKCard";

export default function SKCardList() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SKCard key={i} />
      ))}
    </div>
  );
}
