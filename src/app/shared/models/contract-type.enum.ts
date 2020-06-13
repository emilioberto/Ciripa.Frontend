import { EnumDataSource } from '@app/shared/models/enum-data-source.model';

export enum ContractType {
  Contract,
  Hours
}

export const ContractTypesDataSource: EnumDataSource[] = [
  { id: ContractType.Contract, description: 'Contratto' },
  { id: ContractType.Hours, description: 'Ore' }
];
