import { EnumDataSource } from '@app/shared/models/enum-data-source.model';

export enum PaymentMethod {
  Transfer,
  Cash
}

export const PaymentMethodsDataSource: EnumDataSource[] = [
  { id: PaymentMethod.Transfer, description: 'Bonifico' },
  { id: PaymentMethod.Cash, description: 'Contanti' }
];
