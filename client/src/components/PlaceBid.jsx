import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Input from '../common/Input';
import RupeeIcon from '@mui/icons-material/CurrencyRupee';
import {
  getHighestBid,
  selectAuctionData,
  sendBid,
} from '../features/auctionSlice';
import { isAuctionLive } from '../utils/utilityFunctions';

const PlaceBid = () => {
  const dispatch = useDispatch();
  const [bidAmount, setBidAmount] = useState(0);
  const highestBid = useSelector(getHighestBid);
  const { _id, startTime, endTime } = useSelector(selectAuctionData);

  const placeBid = () => {
    const payload = { auctionId: _id, bidAmount };
    dispatch(sendBid(payload));
    setBidAmount(0);
  };

  return (
    <Paper elevation={2} as={Stack} direction='row' spacing={1} sx={{ p: 2 }}>
      <Input
        name='bid'
        type='number'
        label='Bid Amount'
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        autoFocus
        disabled={!isAuctionLive(startTime, endTime)}
        themeColor='success'
        sx={{ fontWeight: 'bold' }}
        leftContent={() => <RupeeIcon color='success' />}
      />

      <Button
        color='success'
        variant='contained'
        disabled={
          parseInt(highestBid) >= parseInt(Number(bidAmount)) ||
          !isAuctionLive(startTime, endTime)
        }
        onClick={placeBid}
      >
        Bid
      </Button>
    </Paper>
  );
};

export default PlaceBid;
