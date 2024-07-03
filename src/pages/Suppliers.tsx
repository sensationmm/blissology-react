import { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { object, string } from 'yup';

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';

import store, { RootState } from 'src/store';
import { ISupplier } from 'src/store/reducers/suppliers';

import { wpRestApiHandler } from 'src/api/wordpress';

import AddCard from 'src/components/AddCard';
import EditCard from 'src/components/EditCard';
import FormField, { IFormConfig } from 'src/components/FormField';
import Icon, { IIconKey } from 'src/components/Icon';
import Layout from 'src/components/Layout/Layout';

import { capitalize } from 'src/utils/common';
import { formatSuppliersResponse, suppliersPayload } from 'src/utils/wordpress/supplier';
import { getYupErrors } from 'src/utils/yup';

interface IEditSupplier extends ISupplier {
  isNew?: boolean;
}

const Suppliers = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const suppliersState = (state: RootState['suppliers']) => state.suppliers;
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>();

  const Suppliers: ISupplier[] = useSelector(suppliersState);
  const { userID, token } = useSelector(authState);
  const { weddingID } = useSelector(weddingState);

  const newSupplier = {
    contactEmail: '',
    contactName: '',
    contactTelephone: '',
    id: undefined,
    isNew: true,
    name: '',
    notes: '',
    type: '' as IIconKey
  };

  const newSupplierForm: IFormConfig = {
    type: {
      items: ['cakeMaker', 'caterer', 'coordinator', 'entertainment', 'florist', 'photographer', 'stylist', 'videographer'],
      type: 'select'
    }
  };
  const [editSupplier, setEditSupplier] = useState<IEditSupplier>(newSupplier);

  if (userID === null) {
    return <CircularProgress />;
  }

  const saveSuppliers = async () => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });
    setShowEdit(false);
    const actionType = editSupplier.isNew ? 'add' : 'edit';
    delete editSupplier.isNew;

    const supplierSchema = object({
      contactEmail: string().email().nullable(),
      contactName: string().nullable(),
      contactTelephone: string().nullable(),
      name: string().required(),
      notes: string().nullable(),
      type: string().required()
    });

    await supplierSchema
      .validate(editSupplier, { abortEarly: false })
      .then(() => {
        let newSuppliers: ISupplier[] = cloneDeep(Suppliers);
        if (actionType === 'add') {
          newSuppliers[Object.keys(newSuppliers).length] = editSupplier;
          newSuppliers = Object.values(newSuppliers);
        } else {
          newSuppliers = Object.values(newSuppliers).map((supp: ISupplier) => (supp.id === editSupplier.id ? editSupplier : supp));
        }

        wpRestApiHandler(
          `wedding/${weddingID}`,
          {
            acf: {
              suppliers: suppliersPayload(newSuppliers)
            }
          },
          'POST',
          token
        )
          .then((resp) => {
            if (resp.ok) {
              return resp.json();
            }

            return false;
          })
          .then((resp) => {
            onCancelEdit();
            store.dispatch({
              payload: formatSuppliersResponse(resp.acf.suppliers),
              type: 'suppliers/update'
            });
          })
          .finally(() => {
            store.dispatch({
              payload: { isLoading: false },
              type: 'ui/setLoading'
            });
          });
      })
      .catch((error) => {
        setErrors(getYupErrors(error));
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });

        setShowEdit(true);
      });
  };

  const deleteSupplier = (supplierID: number) => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });

    let newSuppliers: ISupplier[] = cloneDeep(Suppliers);
    newSuppliers = Object.values(newSuppliers).filter((s: ISupplier) => s.id !== supplierID);

    wpRestApiHandler(
      `wedding/${weddingID}`,
      {
        acf: {
          suppliers: suppliersPayload(newSuppliers)
        }
      },
      'POST',
      token
    )
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }

        return false;
      })
      .then((resp) => {
        onCancelEdit();
        store.dispatch({
          payload: formatSuppliersResponse(resp.acf.suppliers),
          type: 'suppliers/update'
        });
      })
      .then(() => {
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
  };

  const setSupplierValue = (key: string, value: string) => {
    const supplier = cloneDeep(editSupplier);

    setEditSupplier({
      ...supplier,
      [key]: value
    });
  };

  const handleEditSupplier = (supplier: ISupplier) => {
    setShowEdit(true);
    setEditSupplier({ ...supplier, isNew: false });
  };

  const onCancelEdit = () => {
    setShowEdit(false);
    setEditSupplier(newSupplier);
    setErrors(undefined);
  };

  return (
    <Layout title="Suppliers">
      <div>
        <Grid container spacing={2} className="cards">
          <Grid item xs={4}>
            <AddCard label="Add Supplier" onClick={() => setShowEdit(true)} />
          </Grid>
          {Object.values(Suppliers).map((supplier: ISupplier) => {
            return (
              <Grid key={`supplier-${supplier.contactEmail}`} item xs={4}>
                <EditCard
                  title={supplier.name}
                  subtitle={supplier.type}
                  content={[
                    { text: supplier.contactName },
                    { isSmall: true, text: supplier.contactTelephone },
                    { isSmall: true, text: supplier.contactEmail },
                    { isSmall: true, text: '' }
                  ]}
                  subContent={supplier.notes !== '' ? [{ isSmall: true, text: supplier.notes }] : undefined}
                  icon={<Icon iconKey={supplier.type} color="tertiary" fontSize="inherit" />}
                  context="Supplier"
                  onEdit={() => handleEditSupplier(supplier)}
                  onDelete={() => deleteSupplier(supplier.id as number)}
                />
              </Grid>
            );
          })}
        </Grid>
      </div>

      <Dialog open={showEdit} onClose={onCancelEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" fullWidth={true} maxWidth="sm">
        <DialogTitle>{editSupplier['isNew'] ? 'Add' : 'Edit'} Supplier</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onCancelEdit}
          sx={{
            color: (theme) => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8
          }}>
          <Icon iconKey="close" />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2}>
            {Object.keys(newSupplier)
              .filter((supp) => !['id', 'isNew'].includes(supp))
              .map((supp) => {
                const setup = {
                  error: Object.prototype.hasOwnProperty.call(errors || {}, supp),
                  fullWidth: true,
                  helperText: capitalize(errors?.[supp] || ''),
                  id: supp,
                  label: capitalize(supp),
                  onChangeEvent: setSupplierValue,
                  value: editSupplier[supp as keyof IEditSupplier]
                };

                return <FormField key={`field-${supp}`} fieldId={supp} formConfig={newSupplierForm} setup={setup} />;
              })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveSuppliers}>
            Save Supplier
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Suppliers;
