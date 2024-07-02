import { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

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
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  SvgIconTypeMap,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Select from '@mui/material/Select';

import store, { RootState } from 'src/store';
import { ISupplier } from 'src/store/reducers/suppliers';

import { wpRestApiHandler } from 'src/api/wordpress';

import AddCard from 'src/components/AddCard';
import EditCard from 'src/components/EditCard';
import Layout from 'src/components/Layout/Layout';

import { formatSuppliersResponse, suppliersPayload } from 'src/utils/wordpress/supplier';

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
  const [editSupplier, setEditSupplier] = useState<IEditSupplier>(newSupplier);

  if (userID === null) {
    return <CircularProgress />;
  }

  const saveSuppliers = () => {
    store.dispatch({
      type: 'ui/setLoading',
      payload: { isLoading: true }
    });
    const actionType = editSupplier.isNew ? 'add' : 'edit';
    delete editSupplier.isNew;

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
        console.log('final', resp);
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
        console.log('final', resp);
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
              <Grid key={`supplier-${supplier.id}`} item xs={4}>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Select fullWidth labelId="type-label" id="type" value={editSupplier['type']} onChange={(e) => setSupplierValue('type', e.target.value)}>
                  <MenuItem value="cakeMaker">Cake Maker </MenuItem>
                  <MenuItem value="caterer">Caterer </MenuItem>
                  <MenuItem value="coordinator">Wedding Co-ordinator </MenuItem>
                  <MenuItem value="entertainment">Entertainment </MenuItem>
                  <MenuItem value="florist">Florist </MenuItem>
                  <MenuItem value="photographer">Photographer </MenuItem>
                  <MenuItem value="stylist">Stylist </MenuItem>
                  <MenuItem value="videographer">Videographer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField type="text" fullWidth id={'name'} label="Name" value={editSupplier['name']} onChange={(e) => setSupplierValue('name', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                fullWidth
                id={'contactName'}
                label="Contact Name"
                value={editSupplier['contactName']}
                onChange={(e) => setSupplierValue('contactName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                fullWidth
                id={'contactTelephone'}
                label="Contact Telephone"
                value={editSupplier['contactTelephone']}
                onChange={(e) => setSupplierValue('contactTelephone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                fullWidth
                id={'contactEmail'}
                label="Contact Email"
                value={editSupplier['contactEmail']}
                onChange={(e) => setSupplierValue('contactEmail', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField type="text" fullWidth id={'notes'} label="Notes" value={editSupplier['notes']} onChange={(e) => setSupplierValue('notes', e.target.value)} />
            </Grid>
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
