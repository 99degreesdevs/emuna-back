import { ClassScheduleTransaction } from './class-schedule-transaction.entity';
export { ClassScheduleTransaction } from './class-schedule-transaction.entity';

export const classScheduleTransactionProvider = [
    {
      provide: "CLASS_SCHEDULE_TRANSACTION_REPOSITORY",
      useValue: ClassScheduleTransaction,
    },
  ];