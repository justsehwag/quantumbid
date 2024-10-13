import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import AuctionItem from '../components/AuctionItem';
import { getMyAuctions } from '../features/profileSlice';

const MyAuctions = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth.userLogin);
  const { loading, error, data } = useSelector(
    (state) => state.profile.myAuctions
  );

  useEffect(() => {
    dispatch(getMyAuctions());
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
              My Auctions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body1' textAlign='center' color='grey'>
              Below is a list of auctions that you have initiated
            </Typography>
          </Grid>
          {loading ? (
            <Grid item xs={10} sm={6}>
              <Loader />
            </Grid>
          ) : error ? (
            <Grid item mt={5} xs={12}>
              <Alert message={error} severity='error' />
            </Grid>
          ) : data?.length === 0 ? (
            <Grid item mt={5} xs={12}>
              <Alert
                title='No auction found!'
                message={`It looks like you haven't created any auctions yet. Once you create an auction, it will appear here.`}
                severity='warning'
              />
            </Grid>
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

export default MyAuctions;
