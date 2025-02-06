import { Day } from "./day.entity";
export { Day } from "./day.entity";

export const daysProvider = [
  {
    provide: "DAYS_REPOSITORY",
    useValue: Day,
  },
];
