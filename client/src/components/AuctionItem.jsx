import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ClockStart from '@mui/icons-material/TimerOutlined';
import ClockEnd from '@mui/icons-material/TimerOffOutlined';
import LocationIcon from '@mui/icons-material/Room';
import Eye from '@mui/icons-material/Visibility';

const AuctionItem = (props) => {
  const { _id, itemName, image, startTime, endTime, state } = props;

  const isLive = (startTime, endTime) => {
    return new Date(startTime) < new Date() && new Date(endTime) > new Date();
  };

  return (
    <Card raised sx={{ maxWidth: 300, mx: 'auto' }}>
      <CardActionArea>
        <CardMedia
          height={200}
          sx={{ objectFit: 'contain' }}
          component='img'
          image={image}
          alt={itemName}
          title={itemName}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h5'
            component='h2'
            textAlign='center'
          >
            {itemName}
          </Typography>
          <CardSubtitle sx={{ mb: 1, fontWeight: 'bold' }}>
            <ClockStart fontSize='small' color='success' />{' '}
            <span title='Starting Time'>
              Onwards - {new Date(startTime).toLocaleString()}
            </span>
          </CardSubtitle>
          <CardSubtitle sx={{ mb: 1, fontWeight: 'bold' }}>
            <ClockEnd fontSize='small' color='error' />{' '}
            <span title='Ending Time'>
              Closing - {new Date(endTime).toLocaleString()}
            </span>
          </CardSubtitle>
          <CardSubtitle>
            <LocationIcon fontSize='small' color='warning' />{' '}
            <span>{state}</span>
          </CardSubtitle>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size='small'
          variant='contained'
          color='secondary'
          endIcon={<Eye />}
        >
          <Link to={`/auction/${_id}`}>View</Link>
        </Button>
        {isLive(startTime, endTime) && (
          <Typography
            variant='subtitle1'
            color={'error'}
            title='This auctions is live now'
          >
            <StyledBadge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant='dot'
            />
            Live
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default AuctionItem;

const CardSubtitle = ({ children, ...rest }) => {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      as={Stack}
      spacing={1}
      direction='row'
      justifyContent='center'
      alignItems='center'
      {...rest}
    >
      {children}
    </Typography>
  );
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    margin: `0 10px 0 0`,
    backgroundColor: `${theme.palette.error.main}`,
    color: `${theme.palette.error.main}`,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
