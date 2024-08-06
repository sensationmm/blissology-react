import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { mixed, object, string } from 'yup';

import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Card from '@mui/material/Card';

import store, { RootState } from 'src/store';
import { IRoomAllocation } from 'src/store/reducers/roomAllocations';
import { initialState as emptyRoomsState, IRoom, IRooms } from 'src/store/reducers/rooms';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';
import ReduxTextField from 'src/components/ReduxTextField';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { useUnsaved } from 'src/hooks/useUnsaved';
import { capitalize } from 'src/utils/common';
import { formatRoomsResponse } from 'src/utils/wordpress/rooms';
import { getYupErrors } from 'src/utils/yup';

const Accommodation = () => {
  const weddingState = (state: RootState) => state.wedding;
  const { weddingID } = useSelector(weddingState);
  const authState = (state: RootState) => state.auth;
  const { token } = useSelector(authState);
  const roomsState = (state: RootState) => state.rooms;
  const Rooms: IRooms = useSelector(roomsState);
  const roomAllocationsState = (state: RootState) => state.roomAllocations;
  const RoomAllocations: IRoomAllocation[] = useSelector(roomAllocationsState);
  const [errors, setErrors] = useState<Record<string, string>>();
  const [openSnackbar] = useSnackbar();
  const [resetAllocations, setResetAllocations] = useState<RootState['roomAllocations']>();

  const isEdited = JSON.stringify(RoomAllocations) !== JSON.stringify(resetAllocations);

  useEffect(() => {
    if (Rooms === emptyRoomsState && !!token) {
      store.dispatch({
        payload: { isLoading: true },
        type: 'ui/setLoading'
      });
      wpRestApiHandler(`accommodation`, undefined, 'GET', token).then(async (resp) => {
        const respJson = await resp.json();

        const dispatchPayload = formatRoomsResponse(respJson);

        await store.dispatch({
          payload: dispatchPayload,
          type: 'rooms/set'
        });
        store.dispatch({
          payload: { isLoading: false },
          type: 'ui/setLoading'
        });
      });
    }
  }, []);

  useEffect(() => {
    setResetAllocations(cloneDeep(RoomAllocations));
  }, []);

  const updateRoomAllocation = (id: number, key: string, value: string) => {
    store.dispatch({
      payload: { id: id, key: key, value: value },
      type: 'roomAllocations/update'
    });
  };

  const saveRoomAllocations = async () => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });

    const allocationSchema = object({
      contact_email: string().email().nullable(),
      contact_name: string().nullable(),
      guest_name: string().nullable(),
      payment: mixed().oneOf(['guest', 'invoice'])
    });

    // TODO: yup validate not working yet
    await /*allocationSchema
      // .validate(RoomAllocations, { abortEarly: false })
      .then(() => {*/
        wpRestApiHandler(
          `wedding/${weddingID}`,
          {
            acf: {
              room_allocations: RoomAllocations
            }
          },
          'POST',
          token
        ).then(async (resp) => {
          const respJson = await resp.json();
    
          store.dispatch({
            payload: { isLoading: false },
            type: 'ui/setLoading'
          });
    
          if (!respJson.data?.status) {
            openSnackbar('Room allocations updated');
            return respJson;
          } else {
            openSnackbar(respJson.message, 'error');
          }
        }).catch((error) => {
            setErrors(getYupErrors(error));
            store.dispatch({
              payload: { isLoading: false },
              type: 'ui/setLoading'
            });
            openSnackbar('Fix the errors and try again', 'error');
      });
  };

  const resetRoomAllocations = () => {
    store.dispatch({
      payload: { roomAllocations: resetAllocations },
      type: 'roomAllocations/set'
    });
  };

  useUnsaved({
    isUnsaved: isEdited,
    onConfirm: resetRoomAllocations
  });

  return (
    <Layout
      title="Accommodation"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: resetRoomAllocations },
        { disabled: !isEdited, label: 'Save', onClick: saveRoomAllocations }
      ]}>
      <Card sx={{ padding: 0 }}>
        <TableContainer>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Contact Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(RoomAllocations)
                .slice()
                .sort((a: IRoomAllocation, b: IRoomAllocation) => ((a.id || 1) > (b.id || 2) ? 1 : -1))
                .map((roomAllocation: IRoomAllocation) => {
                  const room: IRoom = Object.values(Rooms).find((r) => r.id === roomAllocation.room_id) || ({} as IRoom);
                  return (
                    <TableRow key={`room-${roomAllocation.room_id}`}>
                      <TableCell component="th" scope="row">
                        {room.name}
                      </TableCell>
                      <TableCell>
                        <ReduxTextField
                          id={`allocation-${roomAllocation.room_id}-guestName`}
                          initialValue={roomAllocation.guest_name}
                          onBlur={(val) => updateRoomAllocation(roomAllocation.room_id, 'guest_name', val)}
                          error={Object.prototype.hasOwnProperty.call(errors || {}, 'guest_name')}
                          helperText={capitalize(errors?.guest_name || '')}
                        />
                      </TableCell>
                      <TableCell>
                        <ReduxTextField
                          id={`allocation-${roomAllocation.room_id}-contactEmail`}
                          initialValue={roomAllocation.contact_email}
                          onBlur={(val) => updateRoomAllocation(roomAllocation.room_id, 'contact_email', val)}
                          error={Object.prototype.hasOwnProperty.call(errors || {}, 'contact_email')}
                          helperText={capitalize(errors?.contact_email || '')}
                        />
                      </TableCell>
                      <TableCell>
                        <ReduxTextField
                          id={`allocation-${roomAllocation.room_id}-contactNumber`}
                          initialValue={roomAllocation.contact_number}
                          onBlur={(val) => updateRoomAllocation(roomAllocation.room_id, 'contact_number', val)}
                          error={Object.prototype.hasOwnProperty.call(errors || {}, 'contact_number')}
                          helperText={capitalize(errors?.contact_number || '')}
                        />
                      </TableCell>
                      <TableCell>
                        <Select onChange={(e) => updateRoomAllocation(roomAllocation.room_id, 'payment', e.target.value)} value={roomAllocation.payment} sx={{ width: '100%' }}>
                          <MenuItem value={'guest'}>Guest Pays</MenuItem>
                          <MenuItem value={'invoice'}>Add to Invoice</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  );
};

export default Accommodation;
