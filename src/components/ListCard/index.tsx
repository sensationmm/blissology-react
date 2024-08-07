import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  CardProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';

import { RootState } from 'src/store';
import { IUpgradeItemOptions, IUpgradeParams } from 'src/store/reducers/upgrades';

import Icon from 'src/components/Icon';

import * as Styled from './styles';

type IListCardContentArgs = {
  key: string;
  value: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IListCardContent = { id?: string; Component?: FC<any>; args?: IListCardContentArgs[] };

type IListCardOrder = {
  required: boolean;
  min?: number;
  type?: IUpgradeParams['minimumOrder']['hasMinimum'] | string;
};

type IListCard = {
  title: string;
  content?: IListCardContent[] | string;
  icons?: IListCardContent[];
  selected?: boolean;
  image?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item?: Record<string, any>;
  onSelect?: (orderNum?: number, option?: string) => void;
  sx?: CardProps['sx'];
  order?: IListCardOrder;
  ordered?: number;
  orderedOption?: string;
  isTitleCard?: boolean;
  options?: IUpgradeItemOptions[];
};

const ListCard: FC<IListCard> = ({
  title,
  content,
  icons,
  image,
  item,
  selected = undefined,
  order,
  ordered,
  orderedOption,
  sx = {},
  onSelect = undefined,
  isTitleCard = false,
  options = []
}) => {
  const paddingRight = image ? '40%' : selected !== undefined ? '35px' : 0;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [orderNum, setOrderNum] = useState<string>(ordered?.toString() || order?.min?.toString() || '');
  const [orderOption, setOrderOption] = useState<string>(options[0]?.option || '');
  const [orderError, setOrderError] = useState<boolean>(false);
  const weddingState = (state: RootState) => state.wedding;
  const { quoteLocked } = useSelector(weddingState);

  const parseItem = (itemKey: IListCardContent, count: number) => {
    const { id, Component, args } = itemKey;
    const argsObj: Record<string, string> = {};
    args?.map((arg) => {
      argsObj[arg.key] = item?.[arg.value];
    });

    if (Component && id && item?.[id]) {
      return <Component key={id} {...argsObj} />;
    }

    const string: string = item?.[id as string] as string;

    if (!string) return;

    return (
      <Styled.Description key={`list-card-content-${count}`}>
        <Styled.Typography variant={isTitleCard ? 'h3' : 'body1'}>{string}</Styled.Typography>
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
      onSelect?.(parseInt(orderNum), orderOption);
    }
  };

  const onClick = () => {
    if (!quoteLocked) {
      order && !!order.required && !selected ? handleSelect() : onSelect?.();
    }
  };

  return (
    <Styled.Card isTitleCard={isTitleCard} sx={{ paddingRight: paddingRight, ...sx }}>
      <Styled.Typography component="h2" variant={isTitleCard ? 'h1' : 'h3'} sx={{ mb: '10px' }}>
        {title}
      </Styled.Typography>

      {content &&
        (typeof content === 'string' ? <Styled.Typography variant={isTitleCard ? 'h3' : 'body1'}>{content}</Styled.Typography> : content.length > 0 && content.map(parseItem))}
      {icons && icons.length > 0 && <Styled.Icons>{icons.map(parseItem)}</Styled.Icons>}

      {selected !== undefined && (
        <Styled.SelectedIcon onClick={() => onClick()}>
          {ordered && (
            <Typography variant="body2" sx={{ fontWeight: 'bold', padding: '3px' }} color="primary">
              {orderedOption}
              {!!orderedOption && !!ordered && ' - '}
              {ordered}
              {order?.type === 'percentage' ? '%' : ` ${order?.type}`}
            </Typography>
          )}
          {!quoteLocked && <Icon iconKey={selected ? 'selected' : 'unselected'} color="primary" />}
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
          <Grid container alignItems={'center'} spacing={2}>
            {options.length > 0 && (
              <>
                <Grid item xs={3}>
                  <InputLabel>Options:</InputLabel>
                </Grid>
                <Grid item xs={9}>
                  <Select onChange={(e) => setOrderOption(e.target.value)} value={orderOption} sx={{ width: '100%' }} size="small">
                    {options.map((opt, index) => (
                      <MenuItem key={`option-${index}`} value={opt.option}>
                        {opt.option} (£{opt.price})
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}
            <Grid item xs={3} alignItems={'center'}>
              <InputLabel>Order:</InputLabel>
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
                    {order.type === 'percentage' ? '% of guests' : ` ${order?.type}`}
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
