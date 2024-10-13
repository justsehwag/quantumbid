import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import AuctionRoom from '../components/AuctionRoom';
import AuctionInfo from '../components/AuctionInfo';
import { getAuctionDetails } from '../features/auctionSlice';

const AuctionDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, success, error, data } = useSelector(
    (state) => state.auction.auction
  );

  useEffect(() => {
    if (id) dispatch(getAuctionDetails({ id }));
  }, [id]);

  return (
    <Container sx={{ my: 4 }}>
      {loading ? (
        <Loader sx={{ width: '70%', mx: 'auto', mt: 10 }} />
      ) : error ? (
        <Alert title='Aww Snap!' message={error} severity='error' />
      ) : success && data ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <AuctionInfo />
          </Grid>
          <Grid item xs={12} md={6}>
            <AuctionRoom />
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
};

export default AuctionDetails;
