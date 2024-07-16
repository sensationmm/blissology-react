/* eslint-disable @typescript-eslint/no-explicit-any */

import { IIconKey } from 'src/components/Icon';

export type ISupplier = {
  id: number | undefined;
  type: IIconKey;
  name: string;
  contactName: string;
  contactTelephone: string;
  contactEmail: string;
  notes: string;
};

const initialState: ISupplier[] = [] as ISupplier[];

const suppliersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'suppliers/set':
      return action.payload.suppliers;
    case 'suppliers/update': {
      return action.payload;
    }
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default suppliersReducer;
