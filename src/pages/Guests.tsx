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
      type: `guests/update`,
      payload: { value: parseInt(value), topLevel: object[0], secondLevel: object[1], change: delta }
    });
  };

  const saveGuestNumbers = () => {
    wpRestApiHandler(
      `wedding/${weddingID}`,
      {
        acf: {
          guests: weddingGuestsPayload(Guests)
        }
      },
      'POST',
      token
    )
      .then((resp) => {
        console.log(resp);
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then((json) => console.log(json));
  };

  const resetGuestNumbers = () => {
    store.dispatch({
      type: 'guests/set',
      payload: resetGuests
    });
  };

  return (
    <Layout>
      <Typography component="h1">Guest List</Typography>
      <div>
        {Object.keys(Guests).map((guestsType) => (
          <Card key={`guests-${guestsType}`} sx={{ mt: '20px', p: '15px' }}>
            <Grid container spacing={2}>
              {guestsType !== 'total' && (
                <Grid item xs={12}>
                  <Typography component="h2">{capitalize(guestsType)} Guests</Typography>
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
                  <Grid key={`guests-${guestsType}-1`} item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="h2">Total Guests</Typography>
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
