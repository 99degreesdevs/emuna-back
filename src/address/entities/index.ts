import { Address } from "./address.entity";
export { Address } from "./address.entity";

export const addressProvider = [
  {
    provide: "ADDRESS_REPOSITORY",
    useValue: Address,
  },
];
