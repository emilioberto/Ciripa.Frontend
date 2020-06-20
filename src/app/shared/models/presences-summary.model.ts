import { PresenceListItem } from '@app/shared/models/presence-list-item.model';

export interface PresencesSummary {
  presences: PresenceListItem[];
  totalHours: number;
  totalExtraContractHours: number;
  totalExtraServiceTimeHours: number;
  totalAmount: number;
}
