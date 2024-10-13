import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const Loader = (props) => {
  const { heading, color, px, py, ...rest } = props;
  return (
    <>
      <Stack
        py={py}
        px={px}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          color: 'grey.500',
        }}
        {...rest}
      >
        <Typography variant='h5' textAlign='center' sx={{ my: 3 }}>
          {heading}
        </Typography>
        <LinearProgress color={color} />
      </Stack>
    </>
  );
};

export default Loader;

Loader.defaultProps = {
  color: 'secondary',
  heading: 'Loading...',
  py: 10,
  px: 5,
};
