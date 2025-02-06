import { ProductsCat } from "./products-cat.entity";
export { ProductsCat } from "./products-cat.entity";

export const productsCatProvider = [
  {
    provide: "PRODUCTS_CAT_REPOSITORY",
    useValue: ProductsCat,
  },
];
