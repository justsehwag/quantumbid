import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { orange } from '@mui/material/colors';
import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/FaceRetouchingNatural';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import schema from '../validations/login';
import Input from '../common/Input';
import { loginUser } from '../features/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, isLoggedIn, error } = useSelector(
    (state) => state.auth.userLogin
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) window.location = '/';
    if (isLoggedIn) navigate('/');
  }, [success, isLoggedIn]);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = (data) => dispatch(loginUser(data));

  return (
    <Container>
      <Paper
        elevation={4}
        sx={{
          padding: '2rem',
          my: 4,
          mx: 'auto',
          maxWidth: '40rem',
        }}
      >
        <Stack
          spacing={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: orange[800],
              width: '100px',
              height: '100px',
            }}
          >
            <LoginIcon sx={{ fontSize: '70px' }} />
          </Avatar>

          <Typography as='h1' variant='h3'>
            Login
          </Typography>

          {error && <ErrorMessage variant='body1'>{error}</ErrorMessage>}

          <Stack
            as='form'
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
            sx={{ width: '100%', maxWidth: '500px' }}
          >
            <Input
              control={control}
              name='email'
              label='E-mail'
              placeholder='Your registered email'
              autoFocus
              autoComplete='email'
              error={errors?.email?.message}
              themeColor='warning'
              disabled={loading}
              leftContent={() => {
                return <EmailIcon />;
              }}
            />

            <Input
              control={control}
              name='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              placeholder='Enter your password'
              autoComplete='current-password'
              error={errors?.password?.message}
              themeColor='warning'
              disabled={loading}
              leftContent={() => {
                return <LockIcon />;
              }}
              rightContent={() => {
                return (
                  <IconButton
                    id='pass'
                    aria-label='toggle password visibility'
                    onClick={handleShowPassword}
                    onMouseDown={(e) => e.preventDefault()}
                    edge='end'
                  >
                    {showPassword ? <HideIcon /> : <ShowIcon />}
                  </IconButton>
                );
              }}
            />

            <Button
              type='submit'
              fullWidth
              disabled={loading}
              size='large'
              variant='contained'
              color='warning'
            >
              {loading ? 'Please Wait...' : 'Login'}
            </Button>
          </Stack>

          <Typography>
            Don't have an account?{' '}
            <LoginLink to={'/register'}>Register</LoginLink> here.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;

const LoginLink = styled(Link)`
  color: blue;
`;

const ErrorMessage = styled(Typography)`
  color: red;
  font-weight: bold;
`;
