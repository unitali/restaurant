import type { ImageType } from "./imageType";
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: ImageType;
  categoryId: string;
}
