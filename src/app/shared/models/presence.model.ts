import { Kid } from '@app/shared/models/kid.model';

export interface Presence {
  id?: number;
  date: Date;
  morningEntry?: Date;
  morningExit?: Date;
  eveningEntry?: Date;
  eveningExit?: Date;
  kidId: number;
  kid: Kid;
}
