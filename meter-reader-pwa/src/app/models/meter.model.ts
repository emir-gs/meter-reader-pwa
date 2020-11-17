import { Read } from './../models/read.model';

export class Meter {
  key?: string;
  name: string;
  isDoubleTariffMeter: boolean;
  reads: Read[] = [];
}
