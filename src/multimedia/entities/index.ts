import { Multimedia } from "./multimedia.entity";
export { Multimedia } from "./multimedia.entity";

export const multimediaProvider = [
  {
    provide: "MULTIMEDIA_REPOSITORY",
    useValue: Multimedia,
  },
];
