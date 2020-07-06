import { Kid } from '@app/shared/models/kid.model';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';

export interface Invoice {
  id?: number;
  kidId: number;
  kid: Kid;
  number: string;
  date: Date;
  amount?: number;
  hours: number;
  invoiceAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentDate?: Date;
  subscriptionAmount?: number;
  subscriptionPaidDate?: number;
}
