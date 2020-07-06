import { Kid } from '@app/shared/models/kid.model';
import { Parent } from '@app/shared/models/parent.model';

export interface YearInvoicesTotal {
  kidId: number;
  kid: Kid;
  billingParent: Parent;
  amount: number;
}
