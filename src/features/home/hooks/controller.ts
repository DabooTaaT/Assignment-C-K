import { useQuery } from "@apollo/client/react";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";
import type { HomePageData } from "@/features/home/interface";

export const useHome = () => {
  const { data, loading, error } = useQuery<HomePageData>(GET_HOME_PAGE_DATA);

  return {
    products: data?.products ?? [],
    services: data?.services ?? [],
    loading,
    error,
  };
};
