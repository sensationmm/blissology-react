import { FC } from 'react';

import { IconButton, Tooltip, Typography } from '@mui/material';

import Icon from '../Icon';

type IUpgradeIcon = object;

const UpgradeIcon: FC<IUpgradeIcon> = () => {
  return (
    <Tooltip title={<Typography>This option carries an upgrade cost</Typography>}>
      <IconButton sx={{ padding: 0 }}>
        <Icon iconKey="upgrade" color="warning" fontSize="medium" />
      </IconButton>
    </Tooltip>
  );
};

export default UpgradeIcon;
