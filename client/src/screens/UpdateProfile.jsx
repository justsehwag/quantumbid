import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { purple } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import Loader from '../common/Loader';
import Alert from '../common/Alert';
import Input from '../common/Input';
import schema from '../validations/updateProfile';
import {
  getMyProfile,
  updateProfile,
  resetUpdateProfile,
} from '../features/profileSlice';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const {
    loading: profileLoading,
    success: profileSuccess,
    data: profile,
    error: profileError,
  } = useSelector((state) => state.profile.userProfile);
  const { loading, success, error } = useSelector(
    (state) => state.profile.updateProfile
  );

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (profileSuccess) {
      setValue('name', profile.name);
      setValue('email', profile.email);
      setValue('mobile', profile.mobile);
      const dt = new Date(profile.dateOfBirth);
      const month = (dt.getMonth() + 1).toString().padStart(2, 0);
      const date = dt.getDate().toString().padStart(2, 0);
      const dob = `${dt.getFullYear()}-${month}-${date}`;
      setValue('dateOfBirth', dob);
    }
  }, [profileSuccess]);

  useEffect(() => {
    if (success) toast.success('Profile updated successfully');
    if (error) toast.error(error);
    if (success || error) dispatch(resetUpdateProfile());
  }, [success, error]);

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  const onSubmit = (data) => {
    dispatch(updateProfile(data));
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
            <EditIcon sx={{ fontSize: '70px' }} />
          </Avatar>

          <Typography as='h1' variant='h3' textAlign='center'>
            Update Profile
          </Typography>

          {profileLoading ? (
            <Loader />
          ) : profileError ? (
            <Alert
              title='Trouble fetching profile!'
              severity='error'
              message={profileError}
            />
          ) : profile ? (
            <>
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

                <Button
                  type='submit'
                  fullWidth
                  size='large'
                  variant='contained'
                  color='secondary'
                  disabled={loading}
                >
                  {loading ? 'Please Wait...' : 'Save Changes'}
                </Button>
              </Stack>
            </>
          ) : null}
        </Stack>
      </Paper>
    </Container>
  );
};

export default UpdateProfile;
