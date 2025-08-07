import type { ImageType } from "./imageType";
export interface ProductType {
  id?: string;
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  image?: ImageType;
}
