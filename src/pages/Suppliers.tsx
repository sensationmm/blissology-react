import { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { object, string } from 'yup';

import AddIcon from '@mui/icons-material/Add';
import CakeIcon from '@mui/icons-material/Cake';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SvgIconTypeMap } from '@mui/material';
import Grid from '@mui/material/Grid';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import store, { RootState } from 'src/store';
import { ISupplier } from 'src/store/reducers/suppliers';

import { wpRestApiHandler } from 'src/api/wordpress';

import AddCard from 'src/components/AddCard';
import EditCard from 'src/components/EditCard';
import FormField, { IFormConfig } from 'src/components/FormField';
import Layout from 'src/components/Layout/Layout';

import { capitalize } from 'src/utils/common';
import { formatSuppliersResponse, suppliersPayload } from 'src/utils/wordpress/supplier';
import { getYupErrors } from 'src/utils/yup';

export const SupplierIcons = (supplierType: string) => {
  let Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
  switch (supplierType) {
    case 'photographer':
      Icon = CameraAltIcon;
      break;
    case 'videographer':
      Icon = VideocamIcon;
      break;
    case 'stylist':
      Icon = PaletteIcon;
      break;
    case 'cakeMaker':
      Icon = CakeIcon;
      break;
    case 'entertainment':
      Icon = MusicNoteIcon;
      break;
    case 'caterer':
      Icon = DinnerDiningIcon;
      break;
    case 'coordinator':
      Icon = SupportAgentIcon;
      break;
    case 'florist':
      Icon = LocalFloristIcon;
      break;
    case 'add':
    default:
      Icon = AddIcon;
      break;
  }

  return <Icon color="tertiary" fontSize="inherit" />;
};

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
    id: undefined,
    isNew: true,
    type: '',
    name: '',
    contactName: '',
    contactEmail: '',
    contactTelephone: '',
    notes: ''
  };

  const newSupplierForm: IFormConfig = {
    type: {
      type: 'select',
      items: ['cakeMaker', 'caterer', 'coordinator', 'entertainment', 'florist', 'photographer', 'stylist', 'videographer']
    }
  };
  const [editSupplier, setEditSupplier] = useState<IEditSupplier>(newSupplier);

  if (userID === null) {
    return <CircularProgress />;
  }

  const saveSuppliers = async () => {
    store.dispatch({
      type: 'ui/setLoading',
      payload: { isLoading: true }
    });
    setShowEdit(false);
    const actionType = editSupplier.isNew ? 'add' : 'edit';
    delete editSupplier.isNew;

    const supplierSchema = object({
      type: string().required(),
      name: string().required(),
      contactName: string().nullable(),
      contactEmail: string().email().nullable(),
      contactTelephone: string().nullable(),
      notes: string().nullable()
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
              type: 'suppliers/update',
              payload: formatSuppliersResponse(resp.acf.suppliers)
            });
          })
          .finally(() => {
            store.dispatch({
              type: 'ui/setLoading',
              payload: { isLoading: false }
            });
          });
      })
      .catch((error) => {
        setErrors(getYupErrors(error));
        store.dispatch({
          type: 'ui/setLoading',
          payload: { isLoading: false }
        });

        setShowEdit(true);
      });
  };

  const deleteSupplier = (supplierID: number) => {
    store.dispatch({
      type: 'ui/setLoading',
      payload: { isLoading: true }
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
          type: 'suppliers/update',
          payload: formatSuppliersResponse(resp.acf.suppliers)
        });
      })
      .then(() => {
        store.dispatch({
          type: 'ui/setLoading',
          payload: { isLoading: false }
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
                    { text: supplier.contactTelephone, isSmall: true },
                    { text: supplier.contactEmail, isSmall: true },
                    { text: '', isSmall: true }
                  ]}
                  subContent={supplier.notes !== '' ? [{ text: supplier.notes, isSmall: true }] : undefined}
                  icon={SupplierIcons(supplier.type)}
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
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2}>
            {Object.keys(newSupplier)
              .filter((supp) => !['id', 'isNew'].includes(supp))
              .map((supp) => {
                const setup = {
                  fullWidth: true,
                  id: supp,
                  label: capitalize(supp),
                  value: editSupplier[supp as keyof IEditSupplier],
                  onChangeEvent: setSupplierValue,
                  error: Object.prototype.hasOwnProperty.call(errors || {}, supp),
                  helperText: capitalize(errors?.[supp] || '')
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
