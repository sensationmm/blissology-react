import LiquorIcon from '@mui/icons-material/Liquor';

const ChampagneIcon = () => {
  return (
    <div style={{ color: 'inherit', height: '35px', overflow: 'hidden', paddingRight: '12px', position: 'relative', width: '23px' }}>
      <LiquorIcon sx={{ bottom: '0px', color: (theme) => theme.palette.secondary.main, fontSize: '1.67em', left: '8px', position: 'absolute' }} />
    </div>
  );
};

export default ChampagneIcon;
