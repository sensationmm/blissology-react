import { ISupplier } from 'src/store/reducers/suppliers';

type WPSupplier = {
  supplier_contact_email?: string;
  supplier_contact_name: string;
  supplier_contact_telephone?: string;
  supplier_name: string;
  supplier_notes?: string;
  supplier_type: string;
};

export const formatSuppliersResponse = (suppliers: WPSupplier[]): ISupplier[] => {
  return suppliers.map((sup, count) => ({
    id: count,
    contactEmail: sup.supplier_contact_email || '',
    contactName: sup.supplier_contact_name,
    contactTelephone: sup.supplier_contact_telephone || '',
    name: sup.supplier_name,
    notes: sup.supplier_notes || '',
    type: sup.supplier_type
  }));
};

export const suppliersPayload = (suppliers: ISupplier[]): WPSupplier[] => {
  return suppliers.map((sup) => ({
    supplier_contact_email: sup.contactEmail || undefined,
    supplier_contact_name: sup.contactName,
    supplier_contact_telephone: sup.contactTelephone || undefined,
    supplier_name: sup.name,
    supplier_notes: sup.notes || undefined,
    supplier_type: sup.type
  }));
};
