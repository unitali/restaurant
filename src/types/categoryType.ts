import type { ProductType } from "./productType";

    export interface CategoryType {
      id: string;
      name: string;
      description: string;
      products: ProductType[];
    }