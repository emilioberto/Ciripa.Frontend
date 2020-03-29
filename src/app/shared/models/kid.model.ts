import { ContractType } from '@app/shared/models/contract-type.enum';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';

export interface Kid {
  id: number;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthdate: string;
  from: string | null;
  to: string | null;
  notes: string;
  contractType: ContractType;
  contractValue: number;
  subscriptionPaid: boolean;
  subscription: number;
  parentFirstName: string;
  parentLastName: string;
  parentFiscalCode: string;
  address: string;
  city: string;
  cap: string;
  province: string;
  paymentMethod: PaymentMethod;
}
