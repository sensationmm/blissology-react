import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import { Button, Card, CircularProgress, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import store, { RootState } from 'src/store';

import { wpRestApiHandler } from 'src/api/wordpress';

import Actions from 'src/components/Actions/Actions';
import Layout from 'src/components/Layout/Layout';
import ReduxTextField from 'src/components/ReduxTextField';

import { useSnackbar } from 'src/hooks/useSnackbar';
import { capitalize } from 'src/utils/common';
import { weddingGuestsPayload } from 'src/utils/wordpress/wedding';

const Guests = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const weddingState = (state: RootState['wedding']) => state.wedding;
  const guestsState = (state: RootState['guests']) => state.guests;

  const Guests = useSelector(guestsState);
  const { userID, token } = useSelector(authState);
  const { weddingID } = useSelector(weddingState);
  const [resetGuests, setResetGuests] = useState<RootState['guests']>();
  const [openSnackbar] = useSnackbar();

  if (userID === null) {
    return <CircularProgress />;
  }

  useEffect(() => {
    setResetGuests(cloneDeep(Guests));
  }, []);

  const updateGuestValue = (id: string, value: string, original: number) => {
    const object = id.split('.');

    const delta = parseInt(value) - original;

    store.dispatch({
      payload: { change: delta, secondLevel: object[1], topLevel: object[0], value: parseInt(value) },
      type: `guests/update`
    });
  };

  const saveGuestNumbers = () => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });

    wpRestApiHandler(
      `wedding/${weddingID}`,
      {
        acf: {
          guests: weddingGuestsPayload(Guests)
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
        openSnackbar('Guest numbers updated');
        return respJson;
      } else {
        openSnackbar(respJson.message, 'error');
      }
    });
  };

  const resetGuestNumbers = () => {
    store.dispatch({
      payload: resetGuests,
      type: 'guests/set'
    });
  };

  return (
    <Layout title="Guest List">
      <div>
        {Object.keys(Guests).map((guestsType) => (
          <Card key={`guests-${guestsType}`} sx={{ mt: '20px', p: '15px' }}>
            <Grid container spacing={2}>
              {guestsType !== 'total' && (
                <Grid item xs={12}>
                  <Typography variant="h2">{capitalize(guestsType)} Guests</Typography>
                </Grid>
              )}
              {guestsType !== 'total' ? (
                Object.keys(Guests[guestsType]).map((personType) => {
                  const fieldId = [guestsType, personType].join('.');
                  return (
                    <Grid key={`guests-${guestsType}-${personType}`} item xs={3}>
                      <ReduxTextField
                        type="number"
                        id={fieldId}
                        label={capitalize(personType)}
                        initialValue={Guests[guestsType][personType]}
                        disabled={personType === 'total'}
                        onBlur={(val) => updateGuestValue(fieldId, val, Guests[guestsType][personType])}
                      />
                    </Grid>
                  );
                })
              ) : (
                <>
                  <Grid key={`guests-${guestsType}-1`} item xs={3} sx={{ alignItems: 'center', display: 'flex' }}>
                    <Typography variant="h2">Total Guests</Typography>
                  </Grid>
                  <Grid key={`guests-${guestsType}-2`} item xs={3}></Grid>
                  <Grid key={`guests-${guestsType}-3`} item xs={3}></Grid>
                  <Grid key={`guests-${guestsType}-total`} item xs={3}>
                    <TextField id="username1" label="Total" variant="outlined" value={Guests[guestsType]} disabled />
                  </Grid>
                </>
              )}
            </Grid>
          </Card>
        ))}

        <Actions>
          <Button variant="contained" onClick={saveGuestNumbers}>
            Save Guest Numbers
          </Button>
          <Button variant="contained" color="secondary" onClick={resetGuestNumbers}>
            Reset
          </Button>
        </Actions>
      </div>
    </Layout>
  );
};

export default Guests;
