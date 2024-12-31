// useGatherings.ts
import { useEffect, useState } from "react";
import { getMyJoinedGatherings } from "@/apis/searchGatheringApi";
import { GetMyJoinedGatheringsRes } from "@/types/api/gatheringApi";

export const useGatherings = () => {
  const [gatherings, setGatherings] = useState<GetMyJoinedGatheringsRes>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchGatherings = async (currentPage: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        completed: false,
        reviewed: false,
        size: 5,
        page: currentPage,
        sort: "id.gathering.dateTime",
        direction: "desc" as const,
      };
      const data = await getMyJoinedGatherings(params);
      setGatherings(prev => {
        const uniqueData = data.filter(
          newItem => !prev.some(existingItem => existingItem.id === newItem.id),
        );
        return [...prev, ...uniqueData];
      });
      setHasMore(data.length > 0);
    } catch (err) {
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore && loading) return;
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchGatherings(page);
  }, [page]);

  return { gatherings, loading, error, loadMore, hasMore };
};
