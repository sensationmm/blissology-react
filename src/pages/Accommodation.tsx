import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import store, { RootState } from 'src/store';
import { initialState as emptyRoomsState, IRoom, IRooms } from 'src/store/reducers/rooms';

import { wpRestApiHandler } from 'src/api/wordpress';

import Layout from 'src/components/Layout/Layout';

import { formatRoomsResponse } from 'src/utils/wordpress/rooms';

const Accommodation = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const { token } = useSelector(authState);
  const roomsState = (state: RootState['rooms']) => state.rooms;
  const Rooms: IRooms = useSelector(roomsState);

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

  return (
    <Layout title="Accommodation">
      <Grid container spacing={2}>
        {Object.values(Rooms)
          .slice()
          // .sort((a, b) => (a.title > b.title ? 1 : -1))
          .map((room: IRoom, index: number) => (
            <Grid item xs={4} key={index}>
              <Card>
                <Typography color="textSecondary" gutterBottom>
                  {room.name}
                </Typography>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
};

export default Accommodation;
