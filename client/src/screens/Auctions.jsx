import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import AuctionItem from '../components/AuctionItem';
import { getAuctions } from '../features/auctionSlice';

const Auctions = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth.userLogin);
  const { loading, error, data } = useSelector(
    (state) => state.auction.auctions
  );

  useEffect(() => {
    dispatch(getAuctions());
  }, []);
  return (
    <>
      <Container sx={{ mb: 4 }}>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid item xs={12}>
            <Typography
              variant='h2'
              textAlign='center'
              sx={{ my: 3 }}
              component='h1'
            >
              Auctions
            </Typography>
          </Grid>
          {loading ? (
            <Grid item xs={10} sm={6}>
              <Loader />
            </Grid>
          ) : error ? (
            <Alert message={error} severity='error' />
          ) : data?.length === 0 ? (
            <Alert
              title='No auction found!'
              message="The auctions are busy signing autographs for their fans. Don’t worry, you’ll catch their next performance soon!"
              severity='warning'
            />
          ) : (
            data?.map((auction) => (
              <Grid p={4} key={auction._id} item xs={12} sm={6} lg={4}>
                <AuctionItem
                  _id={auction._id}
                  itemName={auction.itemName}
                  image={auction.images[0].url}
                  startTime={auction.startTime}
                  endTime={auction.endTime}
                  state={auction.state}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
      {isLoggedIn && (
        <Link to='/auction/create'>
          <Fab
            title='Start an Auction'
            color='secondary'
            aria-label='edit'
            sx={{ position: 'fixed', bottom: '10%', right: '10%' }}
          >
            <EditIcon />
          </Fab>
        </Link>
      )}
    </>
  );
};

export default Auctions;
