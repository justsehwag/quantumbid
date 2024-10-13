import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ClockIcon from '@mui/icons-material/AccessTime';
import { formatCurrency } from '../utils/utilityFunctions';

const BidCard = (props) => {
  const {
    bidder: { name, avatar },
    amount,
    timestamp,
  } = props;

  return (
    <Card sx={{ my: 2 }}>
      <Stack direction='row' spacing={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt='Remy Sharp'
            src={avatar}
            sx={{ width: 60, height: 60 }}
          />
        </Box>
        <Divider orientation='vertical' flexItem />
        <Box>
          <Typography color='grey' variant='body1'>
            {name}'s bid for
          </Typography>
          <Typography color='success.dark' variant='h6'>
            {formatCurrency({ amount })}
          </Typography>
          <Typography
            as={Stack}
            direction='row'
            spacing={0.5}
            color='grey'
            variant='body2'
          >
            <ClockIcon fontSize='small' />{' '}
            <span>{new Date(timestamp).toLocaleString()}</span>
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

export default BidCard;
