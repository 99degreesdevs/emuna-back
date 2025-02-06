import { UsoCfdi } from "./uso-cfdi.entity";
export { UsoCfdi } from "./uso-cfdi.entity";

export const usoCfdiProvider = [
    {
      provide: 'USO_CFDI_REPOSITORY',
      useValue: UsoCfdi,
    },
  ];