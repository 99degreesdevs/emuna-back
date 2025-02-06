import { Order } from "./order.entity";
export { Order } from "./order.entity";

export const orderProvider = [
  {
    provide: "ORDER_REPOSITORY",
    useValue: Order,
  },
];
