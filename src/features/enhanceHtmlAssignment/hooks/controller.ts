import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS, GET_SERVICES } from "../services/queries";
import type { Product, Service, EnhanceHtmlAssignmentState } from "../interface";

export const useEnhanceHtmlAssignment = (): EnhanceHtmlAssignmentState => {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useQuery<{ services: Service[] }>(GET_SERVICES);

  const loading = productsLoading || servicesLoading;
  const error = productsError?.message ?? servicesError?.message;

  return {
    products: productsData?.products ?? [],
    services: servicesData?.services ?? [],
    loading,
    error,
  };
};
