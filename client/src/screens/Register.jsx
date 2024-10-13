import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { purple } from '@mui/material/colors';
import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import RegisterIcon from '@mui/icons-material/AddReaction';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import LockCircleIcon from '@mui/icons-material/LockReset';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import schema from '../validations/register';
import Input from '../common/Input';
import { registerUser } from '../features/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth.userLogin);
  const { loading, success, error } = useSelector(
    (state) => state.auth.userRegister
  );
  const [showPassword, setShowPassword] = useState({
    pass: false,
    cPass: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) window.location = '/';
    if (isLoggedIn) navigate('/');
  }, [success, isLoggedIn]);

  const handleShowPassword = (e) => {
    const field = e.currentTarget.id;
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const onSubmit = (data) => {
    delete data.confirmPassword;
    dispatch(registerUser(data));
  };

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
              bgcolor: purple[500],
              width: '100px',
              height: '100px',
            }}
          >
            <RegisterIcon sx={{ fontSize: '70px' }} />
          </Avatar>

          <Typography as='h1' variant='h3'>
            Register
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
              name='name'
              label='Name'
              placeholder='Enter your full name'
              autoFocus
              error={errors?.name?.message}
              disabled={loading}
              leftContent={() => {
                return <BadgeIcon />;
              }}
            />

            <Input
              control={control}
              name='email'
              label='E-mail'
              placeholder='example@email.com'
              autoComplete='email'
              error={errors?.email?.message}
              disabled={loading}
              leftContent={() => {
                return <EmailIcon />;
              }}
            />

            <Input
              control={control}
              name='mobile'
              label='Mobile'
              placeholder='Valid Indian mobile number'
              error={errors?.mobile?.message}
              disabled={loading}
              leftContent={() => {
                return '+91-';
              }}
            />

            <Input
              control={control}
              name='dateOfBirth'
              type='date'
              label='Date of Birth'
              error={errors?.dateOfBirth?.message}
              disabled={loading}
              leftContent={() => {
                return <CalendarIcon />;
              }}
            />

            <Input
              control={control}
              name='password'
              type={showPassword.pass ? 'text' : 'password'}
              label='Password'
              autoComplete='new-password'
              error={errors?.password?.message}
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
                    {showPassword.pass ? <HideIcon /> : <ShowIcon />}
                  </IconButton>
                );
              }}
            />

            <Input
              control={control}
              name='confirmPassword'
              type={showPassword.cPass ? 'text' : 'password'}
              label='Confirm Password'
              autoComplete='new-password'
              error={errors?.confirmPassword?.message}
              disabled={loading}
              leftContent={() => {
                return <LockCircleIcon />;
              }}
              rightContent={() => {
                return (
                  <IconButton
                    id='cPass'
                    aria-label='toggle password visibility'
                    onClick={handleShowPassword}
                    onMouseDown={(e) => e.preventDefault()}
                    edge='end'
                  >
                    {showPassword.cPass ? <HideIcon /> : <ShowIcon />}
                  </IconButton>
                );
              }}
            />

            <Button
              type='submit'
              fullWidth
              size='large'
              variant='contained'
              color='secondary'
              disabled={loading}
            >
              {loading ? 'Please Wait...' : 'Register'}
            </Button>
          </Stack>

          <Typography>
            Already have an account? <LoginLink to={'/login'}>Login</LoginLink>{' '}
            here.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;

const LoginLink = styled(Link)`
  color: blue;
`;

const ErrorMessage = styled(Typography)`
  color: red;
  font-weight: bold;
`;
