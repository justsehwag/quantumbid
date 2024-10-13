import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import NoPerson from '@mui/icons-material/VoiceOverOff';
import Alert from '../common/Alert';
import {
  getHighestBid,
  getWinnerSellerDetails,
  resetWinnerSellerDetails,
  selectWinnerSellerDetails,
  selectAuctionData,
} from '../features/auctionSlice';
import { formatCurrency } from '../utils/utilityFunctions';

const AuctionWinner = () => {
  const dispatch = useDispatch();
  const { _id, seller, winner } = useSelector(selectAuctionData);
  const { loading, error, data } = useSelector(selectWinnerSellerDetails);
  const highestBid = useSelector(getHighestBid);
  const { user } = useSelector((state) => state.auth.userLogin);

  const requestContactDetails = () => {
    dispatch(getWinnerSellerDetails({ auctionId: _id }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetWinnerSellerDetails());
    };
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <CardActionArea>
        {winner ? (
          <Avatar
            sx={{ mx: 'auto', width: '60px', height: '60px' }}
            src={winner.avatar}
          />
        ) : (
          <Avatar
            sx={{
              mx: 'auto',
              width: '60px',
              height: '60px',
              bgcolor: 'error.dark',
            }}
          >
            <NoPerson fontSize='large' />
          </Avatar>
        )}
        <CardContent>
          <Typography
            gutterBottom
            variant='h5'
            component='p'
            color='success.dark'
            textAlign='center'
          >
            {!winner
              ? 'Nobody Won'
              : winner._id === user.id
              ? 'Hooray! 🎉'
              : 'Winner'}
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='p'
            color='error.dark'
            textAlign='center'
          >
            Highest Bid {formatCurrency({ amount: highestBid })}
          </Typography>
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            {winner
              ? `${
                  winner._id === user.id ? 'You' : winner.name
                } won this auction. Stay tuned for more such auction!`
              : 'Nobody attended this auction. Hence nobody bid on this auction'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ flexDirection: 'column' }}>
        {winner && winner._id === user.id ? (
          <Button
            onClick={requestContactDetails}
            color='error'
            variant='contained'
            sx={{ mx: 'auto' }}
            disabled={loading || !!error || !!data}
          >
            {loading ? 'Please wait...' : 'Show Seller Contact Detail'}
          </Button>
        ) : winner && seller._id === user.id ? (
          <Button
            onClick={requestContactDetails}
            color='error'
            variant='contained'
            sx={{ mx: 'auto' }}
            disabled={loading || !!error || !!data}
          >
            {loading ? 'Please wait...' : 'Show Winner Contact Detail'}
          </Button>
        ) : null}

        <Stack mt={winner ? 3 : 0}>
          {loading ? (
            <CircularProgress color='secondary' />
          ) : error ? (
            <Alert message={error} variant='outlined' />
          ) : data ? (
            <>
              <Typography gutterBottom variant='subtitle1' textAlign='center'>
                Name: {data.contactDetails.name}
              </Typography>
              <Typography gutterBottom variant='subtitle1' textAlign='center'>
                E-mail:{' '}
                <Link
                  href={`mailto:${data.contactDetails.email}`}
                  rel='noopener noreferrer'
                  underline='hover'
                >
                  {data.contactDetails.email}
                </Link>
              </Typography>
              <Typography gutterBottom variant='subtitle1' textAlign='center'>
                Mobile:{' '}
                <Link
                  href={`tel:+91-${data.contactDetails.mobile}`}
                  rel='noopener noreferrer'
                  underline='hover'
                >
                  +91-{data.contactDetails.mobile}
                </Link>
              </Typography>
            </>
          ) : null}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default AuctionWinner;
