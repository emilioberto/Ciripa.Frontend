import { Contract } from '@app/shared/models/contract.model';
import { Parent } from '@app/shared/models/parent.model';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';

export interface Kid {
  id: number;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthdate?: Date;
  from: Date;
  to?: Date;
  contractId: number;
  contract: Contract;
  notes: string;
  subscriptionPaidDate: string;
  subscriptionAmount: number;
  paymentMethod: PaymentMethod;
  extraServicesEnabled: boolean;
  parent1: Parent;
  parent2: Parent;
}
