import { RegimenFiscal } from './regimen-fiscal.entity';
export { RegimenFiscal } from './regimen-fiscal.entity';

export const regimenFiscalProvider = [
  {
    provide: 'REGIMEN_FISCAL_REPOSITORY',
    useValue: RegimenFiscal,
  },
];
