import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import Info from '@mui/icons-material/InfoOutlined';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import Table from '../common/Table';
import { getWonAuctions } from '../features/profileSlice';

const columns = [
  {
    label: 'Item Name',
    path: 'itemName',
  },
  {
    label: 'State',
    path: 'state',
  },
  {
    label: 'Started At',
    path: 'startTime',
    content: (auction) => new Date(auction.startTime).toLocaleString(),
  },
  {
    label: 'Ended At',
    path: 'endTime',
    content: (auction) => new Date(auction.endTime).toLocaleString(),
  },
  {
    label: 'View Auction',
    key: '1',
    content: (auction) => (
      <Link to={`/auction/${auction._id}`}>
        <IconButton aria-label='info'>
          <Info color='secondary' />
        </IconButton>
      </Link>
    ),
  },
];

const WonAuctions = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.profile.wonAuctions
  );

  useEffect(() => {
    dispatch(getWonAuctions());
  }, []);

  return (
    <Container>
      <Typography variant='h2' textAlign='center' sx={{ my: 3 }} component='h1'>
        Won Auctions
      </Typography>
      <Typography variant='body1' textAlign='center' color='grey'>
        Auctions where you emerged as the winning bidder
      </Typography>

      {loading ? (
        <Loader />
      ) : error ? (
        <Box mt={5}>
          <Alert message={error} severity='error' />
        </Box>
      ) : data && data.length === 0 ? (
        <Box mt={5}>
          <Alert
            title='No auction found!'
            message={`You haven't won an auction yet. Keep trying and you'll be successful!.`}
            severity='warning'
          />
        </Box>
      ) : data ? (
        <TableContainer sx={{ mt: 5 }} component={Paper}>
          <Table columns={columns} data={data} />
        </TableContainer>
      ) : null}
    </Container>
  );
};

export default WonAuctions;
