import { Product } from "./product.entity";
export { Product } from "./product.entity";

export const productProvider = [
  {
    provide: "PRODUCT_REPOSITORY",
    useValue: Product,
  },
];
