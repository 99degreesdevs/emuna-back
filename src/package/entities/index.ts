import { Package } from "./package.entity";
export { Package } from "./package.entity";

export const packageProvider = [
  {
    provide: "PACKAGE_REPOSITORY",
    useValue: Package,
  },
];
