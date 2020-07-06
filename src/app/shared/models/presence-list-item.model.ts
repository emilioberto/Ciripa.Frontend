export interface PresenceListItem {
  id?: number;
  date: Date;
  morningEntry?: string;
  morningExit?: string;
  morningHours: number;
  eveningEntry?: string;
  eveningExit?: string;
  eveningHours: number;
  dailyHours: number;
  extraContractHours: number;
  extraServiceTimeHours: number;
  kidId: number;
}
