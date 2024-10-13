import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  getAuctionDetails,
  getHighestBid,
  selectAuctionData,
} from '../features/auctionSlice';
import {
  formatCurrency,
  geRemainingTime,
  isAuctionLive,
} from '../utils/utilityFunctions';

const AuctionTimer = () => {
  const dispatch = useDispatch();
  const highestBid = useSelector(getHighestBid);
  const { _id, startTime, endTime } = useSelector(selectAuctionData);

  const [endingTime, setEndingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const interval = setInterval(() => {
      const startOrEndTime = isAuctionLive(startTime, endTime)
        ? endTime
        : startTime;

      const timeLeft = geRemainingTime(startOrEndTime);
      const numberOfHours = 24;
      const hours = timeLeft.hours + timeLeft.days * numberOfHours;

      setEndingTime((prevTime) => ({ ...prevTime, ...timeLeft, hours }));

      // Refetch auction data when time is up (In either case).
      if (hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
        dispatch(getAuctionDetails({ id: _id }));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper
      as={Stack}
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      elevation={4}
      display='flex'
      alignItems={{ xs: 'center', sm: 'flex-start' }}
      justifyContent='center'
      sx={{ p: 2, mb: 4 }}
    >
      <Box>
        <Typography color='secondary' variant='h6' mb={2} fontWeight='bold'>
          Current Bid
        </Typography>

        <Typography
          textAlign={'center'}
          color='success.dark'
          fontWeight='bold'
          variant='h6'
        >
          {formatCurrency({ amount: highestBid })}
        </Typography>
      </Box>
      <Divider orientation={isSmall ? 'vertical' : 'horizontal'} flexItem />
      <Box>
        <Typography color='secondary' variant='h6' fontWeight='bold' mb={2}>
          {isAuctionLive(startTime, endTime)
            ? 'Auction Ending In'
            : 'Auction Starting In'}
        </Typography>

        <Stack direction='row' spacing={2} color='error.light'>
          <Stack>
            <Typography variant='body1' mb={1}>
              {String(endingTime.hours).padStart(2, 0)}
            </Typography>
            <Typography variant='body1'>Hrs</Typography>
          </Stack>
          <span>:</span>

          <Stack>
            <Typography variant='body1' mb={1}>
              {String(endingTime.minutes).padStart(2, 0)}
            </Typography>
            <Typography variant='body1'>Mins</Typography>
          </Stack>
          <span>:</span>

          <Stack>
            <Typography variant='body1' mb={1}>
              {String(endingTime.seconds).padStart(2, 0)}
            </Typography>
            <Typography variant='body1'>Secs</Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AuctionTimer;
