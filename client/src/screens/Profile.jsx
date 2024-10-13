import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FiberDotIcon from '@mui/icons-material/FiberManualRecord';
import EditIcon from '@mui/icons-material/Edit';
import UsernameIcon from '@mui/icons-material/AlternateEmail';
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneIphone';
import EventIcon from '@mui/icons-material/Event';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import CopyText from '../common/CopyText';
import ChangeAvatarModal from '../components/ChangeAvatarModal';
import { getMyProfile } from '../features/profileSlice';

const Profile = () => {
  const [modalToggle, setModalToggle] = useState(false);
  const elementRef = useRef(null);
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.profile.userProfile
  );

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  const openModal = () => setModalToggle(true);
  const closeModal = () => setModalToggle(false);

  return (
    <Container maxWidth={'md'} sx={{ my: 6 }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert message={error} />
      ) : data ? (
        <Paper elevation={3}>
          <Stack alignItems='center' p={4}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={5}
              justifyContent='center'
              alignItems='center'
            >
              <Box as={Stack} spacing={3} alignItems='center'>
                <Badge
                  overlap='circular'
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Fab
                      onClick={openModal}
                      color='secondary'
                      size='small'
                      aria-label='edit'
                    >
                      <EditIcon />
                    </Fab>
                  }
                >
                  <Box
                    sx={{
                      p: 0.5,
                      border: '4px dotted',
                      borderColor: 'secondary.main',
                      borderRadius: '50%',
                    }}
                  >
                    <Avatar
                      sx={{ width: 200, height: 200 }}
                      alt={data.name}
                      src={data.avatar}
                    />
                  </Box>
                </Badge>
                <Typography variant='h3' component='h1' gutterBottom>
                  {data.name} <FiberDotIcon color='success' />
                </Typography>
              </Box>
              <Divider
                orientation={isSmall ? 'vertical' : 'horizontal'}
                flexItem
              />
              <Stack spacing={3}>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <UsernameIcon color='secondary' />
                  <Typography
                    ref={elementRef}
                    title='User ID'
                    variant='subtitle1'
                    gutterBottom
                  >
                    {data._id}
                  </Typography>
                  <CopyText title='Copy User ID' elementRef={elementRef} />
                </Stack>
                <Stack direction='row' spacing={1}>
                  <FaceIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    Full Name:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {data.name}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <EmailIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    E-mail:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {data.email}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <PhoneIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    Mobile:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    +91-{data.mobile}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <EventIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    Date of Birth:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {new Date(data.dateOfBirth).toString().substring(0, 15)}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <TrophyIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    Auctions Won:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {data.auctionsWonCount}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1}>
                  <GavelIcon color='secondary' />
                  <Typography variant='subtitle1' gutterBottom>
                    Auctions Initiated:
                  </Typography>
                  <Typography variant='subtitle1' gutterBottom>
                    {data.auctionsInitiatedCount}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Box mt={4}>
              <Link to='/profile/update'>
                <Button color='secondary' variant='contained'>
                  Update Profile
                </Button>
              </Link>
            </Box>
          </Stack>
          <ChangeAvatarModal
            openState={modalToggle}
            closeHandler={closeModal}
          />
        </Paper>
      ) : null}
    </Container>
  );
};

export default Profile;
