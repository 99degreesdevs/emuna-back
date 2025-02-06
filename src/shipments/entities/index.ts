import { Shipment } from "./shipment.entity";
export { Shipment } from "./shipment.entity";

export const shipmentProvider = [
  {
    provide: "SHIPMENT_REPOSITORY",
    useValue: Shipment,
  },
];
