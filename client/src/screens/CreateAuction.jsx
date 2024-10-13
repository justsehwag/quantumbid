import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ItemIcon from '@mui/icons-material/Category';
import RupeeIcon from '@mui/icons-material/CurrencyRupee';
import ClockStart from '@mui/icons-material/TimerOutlined';
import ClockEnd from '@mui/icons-material/TimerOffOutlined';
import Location from '@mui/icons-material/PinDrop';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import ImagesIcon from '@mui/icons-material/Collections';
import Input from '../common/Input';
import Select from '../common/Select';
import { createAuction } from '../features/auctionSlice';
import schema, { areValidImages } from '../validations/auction';
import { convertToBase64 } from '../utils/utilityFunctions';
import states from '../utils/states.json';

const CreateAuction = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const { loading, success, data, error } = useSelector(
    (state) => state.auction.createAuction
  );

  const defaultFormValues = {
    itemName: '',
    minimumBid: 0,
    state: '',
    startTime: '',
    endTime: '',
    description: '',
    address: '',
    images: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm({
    mode: 'onTouched',
    defaultValues: defaultFormValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success && data) {
      inputRef.current.value = null;
      reset({ defaultValues: defaultFormValues });
      setImages([]);
    }
  }, [success]);

  const handleImageChange = async (e) => {
    const images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const base64String = await convertToBase64(file);
      images.push(base64String);
    }

    setImages(() => {
      const { error } = areValidImages(images);
      if (error) setError('images', { type: 'custom', message: error });
      else setError('images', { type: 'custom', message: '' });

      return images;
    });
  };

  const onSubmit = (data) => {
    const { error } = areValidImages(images);
    if (error) return setError('images', { type: 'custom', message: error });

    data.images = images;

    dispatch(createAuction(data));
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
          <Typography as='h1' variant='h3'>
            Start an Auction
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
              name='itemName'
              label='Item Name'
              placeholder='Item to sell in auction'
              autoFocus
              error={errors?.itemName?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <ItemIcon color='success' />;
              }}
            />
            <Input
              control={control}
              name='minimumBid'
              type='number'
              label='Minimum Bid Amount'
              error={errors?.minimumBid?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <RupeeIcon color='success' />;
              }}
            />
            <Input
              control={control}
              name='startTime'
              type='datetime-local'
              label='Auction Starting Time'
              error={errors?.startTime?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <ClockStart color='success' />;
              }}
            />
            <Input
              control={control}
              name='endTime'
              type='datetime-local'
              label='Auction Ending Time'
              error={errors?.endTime?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <ClockEnd color='success' />;
              }}
            />
            <Select
              control={control}
              name='state'
              label='Your State'
              error={errors?.state?.message}
              defaultValue=''
              themeColor='success'
              disabled={loading}
              options={states}
              leftContent={() => {
                return <Location color='success' />;
              }}
            />
            <Input
              control={control}
              name='description'
              label='Description'
              multiline
              placeholder='Description of the item.'
              rows={3}
              error={errors?.description?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <DescriptionIcon color='success' />;
              }}
            />
            <Input
              control={control}
              name='address'
              label='Address'
              multiline
              placeholder='Place where you live (Optional)'
              rows={3}
              error={errors?.address?.message}
              themeColor='success'
              disabled={loading}
              leftContent={() => {
                return <HomeIcon color='success' />;
              }}
            />
            <Input
              name='images'
              type='file'
              label='Item Images'
              disableUnderline
              error={errors?.images?.message}
              onChange={handleImageChange}
              themeColor='success'
              disabled={loading}
              inputRef={inputRef}
              inputProps={{
                multiple: true,
                accept: 'image/png, image/jpg, image/jpeg, image/webp',
              }}
              leftContent={() => {
                return <ImagesIcon color='success' />;
              }}
            />

            <Button
              type='submit'
              fullWidth
              disabled={loading}
              size='large'
              variant='contained'
              color='success'
            >
              {loading ? 'Creating Auction...' : 'Create Auction'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateAuction;

const ErrorMessage = styled(Typography)`
  color: red;
  font-weight: bold;
`;
