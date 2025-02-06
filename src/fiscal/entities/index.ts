import { Fiscal } from "./fiscal.entity";
export { Fiscal } from "./fiscal.entity";

export const fiscalProvider = [
  {
    provide: 'FISCAL_REPOSITORY',
    useValue: Fiscal,
  },
];