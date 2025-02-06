import { ClassSchedule } from './class-schedule.entity'; 
export { ClassSchedule } from './class-schedule.entity'; 

export const classScheduleProvider = [
  {
    provide: "CLASS_SCHEDULE_REPOSITORY",
    useValue: ClassSchedule,
  },
];
