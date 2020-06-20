export interface Contract {
  id?: number;
  description: string;
  monthlyContract: boolean;
  dailyHours: number;
  monthlyHours: number;
  hourCost: number;
  extraHourCost: number;
  startTime: Date;
  endTime: Date;
  minContractValue: number;
}
