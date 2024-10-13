import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import AuctionTimer from './AuctionTimer';
import AuctionWinner from './AuctionWinner';
import BidCard from './BidCard';
import PlaceBid from './PlaceBid';
import { socket } from '../services/socket';
import { bidReceived, selectAuctionData } from '../features/auctionSlice';
import { hasAuctionEnded, isAuctionLive } from '../utils/utilityFunctions';

const AuctionRoom = () => {
  const dispatch = useDispatch();
  const { _id, bids, startTime, endTime } = useSelector(selectAuctionData);

  useEffect(() => {
    if (isAuctionLive(startTime, endTime)) {
      socket.emit('auction:join', { auctionId: _id });

      socket.on('auction:joined', () => {
        toast.info('You can start bidding!');
      });

      socket.on('bid:receive', (bid) => {
        dispatch(bidReceived({ bid }));
      });

      socket.on('bid:invalid_bid', (data) => {
        toast.warn(data.error);
      });
    }

    socket.on('connect_error', () => {
     toast.error('Something went wrong. Try again later!');
    });

    return () => {
      socket.emit('auction:leave');
      socket.off('auction:joined');
      socket.off('bid:receive');
      socket.off('bid:invalid_bid');
      socket.off('connect_error');
    };
  }, []);

  return hasAuctionEnded(endTime) ? (
    <AuctionWinner />
  ) : (
    <AuctionRoomContainer>
      <AuctionTimer />
      <BidsContainer>
        {bids.map((bid, idx, bids) => (
          <BidCard
            key={bids[bids.length - idx - 1]._id}
            {...bids[bids.length - idx - 1]}
          />
        ))}
      </BidsContainer>
      <PlaceBid />
    </AuctionRoomContainer>
  );
};

export default AuctionRoom;

const AuctionRoomContainer = styled.section``;

const BidsContainer = styled.div`
  padding: 0.1rem 0.5rem;
  margin-bottom: 2rem;
  overflow-y: scroll;
  height: 43vh;
`;
