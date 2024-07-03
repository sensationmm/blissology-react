import { ISupplier } from 'src/store/reducers/suppliers';

import { IIconKey } from 'src/components/Icon';

type WPSupplier = {
  supplier_contact_email?: string;
  supplier_contact_name: string;
  supplier_contact_telephone?: string;
  supplier_name: string;
  supplier_notes?: string;
  supplier_type: IIconKey;
};

export const formatSuppliersResponse = (suppliers: WPSupplier[]): ISupplier[] => {
  return suppliers.map((sup, count) => ({
    contactEmail: sup.supplier_contact_email || '',
    contactName: sup.supplier_contact_name || '',
    contactTelephone: sup.supplier_contact_telephone || '',
    id: count,
    name: sup.supplier_name,
    notes: sup.supplier_notes || '',
    type: sup.supplier_type
  }));
};

export const suppliersPayload = (suppliers: ISupplier[]): WPSupplier[] => {
  return suppliers.map((sup) => ({
    supplier_contact_email: sup.contactEmail,
    supplier_contact_name: sup.contactName,
    supplier_contact_telephone: sup.contactTelephone,
    supplier_name: sup.name,
    supplier_notes: sup.notes,
    supplier_type: sup.type
  }));
};
