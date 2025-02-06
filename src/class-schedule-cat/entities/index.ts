import { ClassScheduleCat } from "./class-schedule-cat.entity";
export { ClassScheduleCat } from "./class-schedule-cat.entity";


export const classScheduleCatProvider = [
  {
    provide: "CLASS_SCHEDULE_CAT_REPOSITORY",
    useValue: ClassScheduleCat,
  },
];
