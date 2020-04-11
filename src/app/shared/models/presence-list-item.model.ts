export interface PresenceListItem {
  id: number | null;
  date: Date;
  morningEntry: Date;
  morningExit: Date;
  morningHours: number;
  eveningEntry: Date;
  eveningExit: Date;
  eveningHours: number;
  kidId: number;
}
