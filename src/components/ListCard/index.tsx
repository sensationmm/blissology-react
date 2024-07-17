import { FC, useState } from 'react';

import { Button, CardProps, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, Grid, Input, InputAdornment, InputLabel, Typography } from '@mui/material';

import { IMenuItem } from 'src/store/reducers/menu';
import { IUpgradeParams } from 'src/store/reducers/upgrades';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IListCardContentArgs = {
  key: string;
  value: keyof IMenuItem;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IListCardContent = { id?: keyof IMenuItem; Component?: FC<any>; args?: IListCardContentArgs };

type IListCardOrder = {
  required: boolean;
  min?: number;
  type?: IUpgradeParams['minimumOrder']['hasMinimum'];
};

type IListCard = {
  title: string;
  content: IListCardContent[];
  icons?: IListCardContent[];
  selected?: boolean;
  image?: string;
  item: IMenuItem;
  onSelect?: (orderNum?: number) => void;
  sx?: CardProps['sx'];
  order?: IListCardOrder;
  ordered?: number;
};

const ListCard: FC<IListCard> = ({ title, content, icons, image, item, selected = undefined, order, ordered, sx = {}, onSelect = undefined }) => {
  const paddingRight = image ? '40%' : selected !== undefined ? '35px' : 0;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [orderNum, setOrderNum] = useState<string>(ordered?.toString() || order?.min?.toString() || '');
  const [orderError, setOrderError] = useState<boolean>(false);

  const parseItem = (itemKey: IListCardContent, count: number) => {
    const { id, Component, args } = itemKey;
    const argsObj = args ? { [args.key]: item[args.value] } : {};

    if (Component && id && item[id]) {
      return <Component key={id} {...argsObj} />;
    }

    const string: string = item[id as keyof IMenuItem] as string;

    if (!string) return;

    return (
      <Styled.Description key={`list-card-content-${count}`}>
        <Styled.Typography variant={'body1'}>{string}</Styled.Typography>
      </Styled.Description>
    );
  };

  const handleSelect = () => {
    setShowDetails(true);
  };

  const confirmSelect = () => {
    if (order?.min && order.min > parseInt(orderNum)) {
      setOrderError(true);
    } else {
      setShowDetails(false);
      setOrderError(false);
      onSelect?.(parseInt(orderNum));
    }
  };

  return (
    <Styled.Card sx={{ paddingRight: paddingRight, ...sx }}>
      <Styled.Typography component="h2" variant="h3" sx={{ mb: '10px' }}>
        {title}
      </Styled.Typography>

      {content && content.length > 0 && content.map(parseItem)}
      {icons && icons.length > 0 && <Styled.Icons>{icons.map(parseItem)}</Styled.Icons>}

      {selected !== undefined && (
        <Styled.SelectedIcon onClick={order && !!order.required && !selected ? handleSelect : () => onSelect?.()}>
          {ordered && (
            <Typography variant="body2" sx={{ padding: '3px' }}>
              {ordered}
              {order?.type === 'percentage' ? '%' : ' people'}
            </Typography>
          )}
          <Icon iconKey={selected ? 'selected' : 'unselected'} color="primary" />
        </Styled.SelectedIcon>
      )}

      {image && (
        <Styled.Image>
          <img src={image} />
        </Styled.Image>
      )}

      <Dialog open={showDetails} fullWidth={true} maxWidth="xs">
        <DialogTitle variant="h2" color="primary">
          Confirm Order
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems={'center'}>
            <Grid item xs={3} alignItems={'center'}>
              <InputLabel>Order for:</InputLabel>
            </Grid>
            <Grid item xs={9}>
              <Input
                type="number"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                endAdornment={<InputAdornment position="start">{order?.type === 'percentage' ? '%' : order?.type}</InputAdornment>}
                error={orderError}
              />
            </Grid>
            {order?.min && (
              <>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <FormHelperText error={orderError}>
                    Minimum order: {order.min}
                    {order.type === 'percentage' ? '% of guests' : ' people'}
                  </FormHelperText>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="contained" onClick={() => setShowDetails(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmSelect}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Styled.Card>
  );
};

export default ListCard;
