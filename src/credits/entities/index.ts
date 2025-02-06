import { Credit } from "./credit.entity";
export { Credit } from "./credit.entity";


export const creditProvider = [
  {
    provide: "CREDIT_REPOSITORY",
    useValue: Credit,
  },
];
