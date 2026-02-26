export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface EnhanceHtmlAssignmentState {
  products: Product[];
  services: Service[];
  loading: boolean;
  error?: string;
}
