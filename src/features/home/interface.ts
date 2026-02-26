export interface Product {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

export interface Service {
  id: string;
  name: string;
  detail: string;
  imageUrl: string;
}

export interface HomePageData {
  products: Product[];
  services: Service[];
}
